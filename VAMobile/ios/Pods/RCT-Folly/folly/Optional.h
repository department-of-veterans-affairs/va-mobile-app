/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#pragma once

/*
 * Optional - For conditional initialization of values, like boost::optional,
 * but with support for move semantics and emplacement.  Reference type support
 * has not been included due to limited use cases and potential confusion with
 * semantics of assignment: Assigning to an optional reference could quite
 * reasonably copy its value or redirect the reference.
 *
 * Optional can be useful when a variable might or might not be needed:
 *
 *  Optional<Logger> maybeLogger = ...;
 *  if (maybeLogger) {
 *    maybeLogger->log("hello");
 *  }
 *
 * Optional enables a 'null' value for types which do not otherwise have
 * nullability, especially useful for parameter passing:
 *
 * void testIterator(const unique_ptr<Iterator>& it,
 *                   initializer_list<int> idsExpected,
 *                   Optional<initializer_list<int>> ranksExpected = none) {
 *   for (int i = 0; it->next(); ++i) {
 *     EXPECT_EQ(it->doc().id(), idsExpected[i]);
 *     if (ranksExpected) {
 *       EXPECT_EQ(it->doc().rank(), (*ranksExpected)[i]);
 *     }
 *   }
 * }
 *
 * Optional models OptionalPointee, so calling 'get_pointer(opt)' will return a
 * pointer to nullptr if the 'opt' is empty, and a pointer to the value if it is
 * not:
 *
 *  Optional<int> maybeInt = ...;
 *  if (int* v = get_pointer(maybeInt)) {
 *    cout << *v << endl;
 *  }
 */

#include <cstddef>
#include <functional>
#include <new>
#include <stdexcept>
#include <type_traits>
#include <utility>
#if __cplusplus >= 201703L && __has_include(<optional>)
#include <optional>
#endif

#include <folly/Portability.h>
#include <folly/Traits.h>
#include <folly/Utility.h>
#include <folly/lang/Exception.h>

namespace folly {

template <class Value>
class Optional;

namespace detail {
template <class Value>
struct OptionalPromise;
template <class Value>
struct OptionalPromiseReturn;
} // namespace detail

struct None {
  enum class _secret { _token };

  /**
   * No default constructor to support both `op = {}` and `op = none`
   * as syntax for clearing an Optional, just like std::nullopt_t.
   */
  explicit constexpr None(_secret) {}
};
constexpr None none{None::_secret::_token};

class FOLLY_EXPORT OptionalEmptyException : public std::runtime_error {
 public:
  OptionalEmptyException()
      : std::runtime_error("Empty Optional cannot be unwrapped") {}
};

template <class Value>
class Optional {
 public:
  typedef Value value_type;

  using promise_type = detail::OptionalPromise<Value>;

  static_assert(
      !std::is_reference<Value>::value,
      "Optional may not be used with reference types");
  static_assert(
      !std::is_abstract<Value>::value,
      "Optional may not be used with abstract types");

  constexpr Optional() noexcept {}

  Optional(const Optional& src) noexcept(
      std::is_nothrow_copy_constructible<Value>::value) {
    if (src.hasValue()) {
      construct(src.value());
    }
  }

  Optional(Optional&& src) noexcept(
      std::is_nothrow_move_constructible<Value>::value) {
    if (src.hasValue()) {
      construct(std::move(src.value()));
      src.reset();
    }
  }

  constexpr /* implicit */ Optional(const None&) noexcept {}

  constexpr /* implicit */ Optional(Value&& newValue) noexcept(
      std::is_nothrow_move_constructible<Value>::value) {
    construct(std::move(newValue));
  }

  constexpr /* implicit */ Optional(const Value& newValue) noexcept(
      std::is_nothrow_copy_constructible<Value>::value) {
    construct(newValue);
  }

  template <typename... Args>
  constexpr explicit Optional(in_place_t, Args&&... args) noexcept(
      std::is_nothrow_constructible<Value, Args...>::value)
      : Optional{PrivateConstructor{}, std::forward<Args>(args)...} {}

  template <typename U, typename... Args>
  constexpr explicit Optional(
      in_place_t,
      std::initializer_list<U> il,
      Args&&... args) noexcept(std::
                                   is_nothrow_constructible<
                                       Value,
                                       std::initializer_list<U>,
                                       Args...>::value)
      : Optional{PrivateConstructor{}, il, std::forward<Args>(args)...} {}

  // Used only when an Optional is used with coroutines on MSVC
  /* implicit */ Optional(const detail::OptionalPromiseReturn<Value>& p)
      : Optional{} {
    p.promise_->value_ = this;
  }

// Conversions to ease migration to std::optional
#if __cplusplus >= 201703L && __has_include(<optional>)
  template <
      typename U,
      typename = std::enable_if_t<std::is_same_v<U, std::optional<Value>>>>
  explicit Optional(U&& newValue) noexcept(
      std::is_nothrow_move_constructible<Value>::value) {
    if (newValue.has_value()) {
      construct(std::move(*newValue));
      newValue.reset();
    }
  }
  template <
      typename U,
      typename = std::enable_if_t<std::is_same_v<U, std::optional<Value>>>>
  explicit Optional(const U& newValue) noexcept(
      std::is_nothrow_copy_constructible<Value>::value) {
    if (newValue.has_value()) {
      construct(*newValue);
    }
  }
  explicit operator std::optional<Value>() && noexcept(
      std::is_nothrow_move_constructible<Value>::value) {
    std::optional<Value> ret = storage_.hasValue
        ? std::optional<Value>(std::move(storage_.value))
        : std::nullopt;
    reset();
    return ret;
  }
  explicit operator std::optional<Value>() const& noexcept(
      std::is_nothrow_copy_constructible<Value>::value) {
    return storage_.hasValue ? std::optional<Value>(storage_.value)
                             : std::nullopt;
  }
#endif

  void assign(const None&) { reset(); }

  void assign(Optional&& src) {
    if (this != &src) {
      if (src.hasValue()) {
        assign(std::move(src.value()));
        src.reset();
      } else {
        reset();
      }
    }
  }

  void assign(const Optional& src) {
    if (src.hasValue()) {
      assign(src.value());
    } else {
      reset();
    }
  }

  void assign(Value&& newValue) {
    if (hasValue()) {
      storage_.value = std::move(newValue);
    } else {
      construct(std::move(newValue));
    }
  }

  void assign(const Value& newValue) {
    if (hasValue()) {
      storage_.value = newValue;
    } else {
      construct(newValue);
    }
  }

  Optional& operator=(None) noexcept {
    reset();
    return *this;
  }

  template <class Arg>
  Optional& operator=(Arg&& arg) {
    assign(std::forward<Arg>(arg));
    return *this;
  }

  Optional& operator=(Optional&& other) noexcept(
      std::is_nothrow_move_assignable<Value>::value) {
    assign(std::move(other));
    return *this;
  }

  Optional& operator=(const Optional& other) noexcept(
      std::is_nothrow_copy_assignable<Value>::value) {
    assign(other);
    return *this;
  }

  template <class... Args>
  Value& emplace(Args&&... args) {
    reset();
    construct(std::forward<Args>(args)...);
    return value();
  }

  template <class U, class... Args>
  typename std::enable_if<
      std::is_constructible<Value, std::initializer_list<U>&, Args&&...>::value,
      Value&>::type
  emplace(std::initializer_list<U> ilist, Args&&... args) {
    reset();
    construct(ilist, std::forward<Args>(args)...);
    return value();
  }

  void reset() noexcept { storage_.clear(); }

  void clear() noexcept { reset(); }

  void swap(Optional& that) noexcept(IsNothrowSwappable<Value>::value) {
    if (hasValue() && that.hasValue()) {
      using std::swap;
      swap(value(), that.value());
    } else if (hasValue()) {
      that.emplace(std::move(value()));
      reset();
    } else if (that.hasValue()) {
      emplace(std::move(that.value()));
      that.reset();
    }
  }

  constexpr const Value& value() const& {
    require_value();
    return storage_.value;
  }

  constexpr Value& value() & {
    require_value();
    return storage_.value;
  }

  constexpr Value&& value() && {
    require_value();
    return std::move(storage_.value);
  }

  constexpr const Value&& value() const&& {
    require_value();
    return std::move(storage_.value);
  }

  const Value* get_pointer() const& {
    return storage_.hasValue ? &storage_.value : nullptr;
  }
  Value* get_pointer() & {
    return storage_.hasValue ? &storage_.value : nullptr;
  }
  Value* get_pointer() && = delete;

  constexpr bool has_value() const noexcept { return storage_.hasValue; }

  constexpr bool hasValue() const noexcept { return has_value(); }

  constexpr explicit operator bool() const noexcept { return has_value(); }

  constexpr const Value& operator*() const& { return value(); }
  constexpr Value& operator*() & { return value(); }
  constexpr const Value&& operator*() const&& { return std::move(value()); }
  constexpr Value&& operator*() && { return std::move(value()); }

  constexpr const Value* operator->() const { return &value(); }
  constexpr Value* operator->() { return &value(); }

  // Return a copy of the value if set, or a given default if not.
  template <class U>
  constexpr Value value_or(U&& dflt) const& {
    if (storage_.hasValue) {
      return storage_.value;
    }

    return std::forward<U>(dflt);
  }

  template <class U>
  constexpr Value value_or(U&& dflt) && {
    if (storage_.hasValue) {
      return std::move(storage_.value);
    }

    return std::forward<U>(dflt);
  }

 private:
  template <class T>
  friend constexpr Optional<std::decay_t<T>> make_optional(T&&);
  template <class T, class... Args>
  friend constexpr Optional<T> make_optional(Args&&... args);
  template <class T, class U, class... As>
  friend constexpr Optional<T> make_optional(std::initializer_list<U>, As&&...);

  /**
   * Construct the optional in place, this is duplicated as a non-explicit
   * constructor to allow returning values that are non-movable from
   * make_optional using list initialization.
   *
   * Until C++17, at which point this will become unnecessary because of
   * specified prvalue elision.
   */
  struct PrivateConstructor {
    explicit PrivateConstructor() = default;
  };
  template <typename... Args>
  constexpr Optional(PrivateConstructor, Args&&... args) noexcept(
      std::is_constructible<Value, Args&&...>::value) {
    construct(std::forward<Args>(args)...);
  }

  void require_value() const {
    if (!storage_.hasValue) {
      throw_exception<OptionalEmptyException>();
    }
  }

  template <class... Args>
  void construct(Args&&... args) {
    const void* ptr = &storage_.value;
    // For supporting const types.
    new (const_cast<void*>(ptr)) Value(std::forward<Args>(args)...);
    storage_.hasValue = true;
  }

  struct StorageTriviallyDestructible {
    union {
      char emptyState;
      Value value;
    };
    bool hasValue;

    constexpr StorageTriviallyDestructible()
        : emptyState('\0'), hasValue{false} {}
    void clear() { hasValue = false; }
  };

  struct StorageNonTriviallyDestructible {
    union {
      char emptyState;
      Value value;
    };
    bool hasValue;

    StorageNonTriviallyDestructible() : hasValue{false} {}
    ~StorageNonTriviallyDestructible() { clear(); }

    void clear() {
      if (hasValue) {
        hasValue = false;
        value.~Value();
      }
    }
  };

  using Storage = typename std::conditional<
      std::is_trivially_destructible<Value>::value,
      StorageTriviallyDestructible,
      StorageNonTriviallyDestructible>::type;

  Storage storage_;
};

template <class T>
const T* get_pointer(const Optional<T>& opt) {
  return opt.get_pointer();
}

template <class T>
T* get_pointer(Optional<T>& opt) {
  return opt.get_pointer();
}

template <class T>
void swap(Optional<T>& a, Optional<T>& b) noexcept(noexcept(a.swap(b))) {
  a.swap(b);
}

template <class T>
constexpr Optional<std::decay_t<T>> make_optional(T&& v) {
  using PrivateConstructor =
      typename folly::Optional<std::decay_t<T>>::PrivateConstructor;
  return {PrivateConstructor{}, std::forward<T>(v)};
}

template <class T, class... Args>
constexpr folly::Optional<T> make_optional(Args&&... args) {
  using PrivateConstructor = typename folly::Optional<T>::PrivateConstructor;
  return {PrivateConstructor{}, std::forward<Args>(args)...};
}

template <class T, class U, class... Args>
constexpr folly::Optional<T> make_optional(
    std::initializer_list<U> il, Args&&... args) {
  using PrivateConstructor = typename folly::Optional<T>::PrivateConstructor;
  return {PrivateConstructor{}, il, std::forward<Args>(args)...};
}

///////////////////////////////////////////////////////////////////////////////
// Comparisons.

template <class U, class V>
constexpr bool operator==(const Optional<U>& a, const V& b) {
  return a.hasValue() && a.value() == b;
}

template <class U, class V>
constexpr bool operator!=(const Optional<U>& a, const V& b) {
  return !(a == b);
}

template <class U, class V>
constexpr bool operator==(const U& a, const Optional<V>& b) {
  return b.hasValue() && b.value() == a;
}

template <class U, class V>
constexpr bool operator!=(const U& a, const Optional<V>& b) {
  return !(a == b);
}

template <class U, class V>
constexpr bool operator==(const Optional<U>& a, const Optional<V>& b) {
  if (a.hasValue() != b.hasValue()) {
    return false;
  }
  if (a.hasValue()) {
    return a.value() == b.value();
  }
  return true;
}

template <class U, class V>
constexpr bool operator!=(const Optional<U>& a, const Optional<V>& b) {
  return !(a == b);
}

template <class U, class V>
constexpr bool operator<(const Optional<U>& a, const Optional<V>& b) {
  if (a.hasValue() != b.hasValue()) {
    return a.hasValue() < b.hasValue();
  }
  if (a.hasValue()) {
    return a.value() < b.value();
  }
  return false;
}

template <class U, class V>
constexpr bool operator>(const Optional<U>& a, const Optional<V>& b) {
  return b < a;
}

template <class U, class V>
constexpr bool operator<=(const Optional<U>& a, const Optional<V>& b) {
  return !(b < a);
}

template <class U, class V>
constexpr bool operator>=(const Optional<U>& a, const Optional<V>& b) {
  return !(a < b);
}

// Suppress comparability of Optional<T> with T, despite implicit conversion.
template <class V>
bool operator<(const Optional<V>&, const V& other) = delete;
template <class V>
bool operator<=(const Optional<V>&, const V& other) = delete;
template <class V>
bool operator>=(const Optional<V>&, const V& other) = delete;
template <class V>
bool operator>(const Optional<V>&, const V& other) = delete;
template <class V>
bool operator<(const V& other, const Optional<V>&) = delete;
template <class V>
bool operator<=(const V& other, const Optional<V>&) = delete;
template <class V>
bool operator>=(const V& other, const Optional<V>&) = delete;
template <class V>
bool operator>(const V& other, const Optional<V>&) = delete;

// Comparisons with none
template <class V>
constexpr bool operator==(const Optional<V>& a, None) noexcept {
  return !a.hasValue();
}
template <class V>
constexpr bool operator==(None, const Optional<V>& a) noexcept {
  return !a.hasValue();
}
template <class V>
constexpr bool operator<(const Optional<V>&, None) noexcept {
  return false;
}
template <class V>
constexpr bool operator<(None, const Optional<V>& a) noexcept {
  return a.hasValue();
}
template <class V>
constexpr bool operator>(const Optional<V>& a, None) noexcept {
  return a.hasValue();
}
template <class V>
constexpr bool operator>(None, const Optional<V>&) noexcept {
  return false;
}
template <class V>
constexpr bool operator<=(None, const Optional<V>&) noexcept {
  return true;
}
template <class V>
constexpr bool operator<=(const Optional<V>& a, None) noexcept {
  return !a.hasValue();
}
template <class V>
constexpr bool operator>=(const Optional<V>&, None) noexcept {
  return true;
}
template <class V>
constexpr bool operator>=(None, const Optional<V>& a) noexcept {
  return !a.hasValue();
}

///////////////////////////////////////////////////////////////////////////////

} // namespace folly

// Allow usage of Optional<T> in std::unordered_map and std::unordered_set
FOLLY_NAMESPACE_STD_BEGIN
template <class T>
struct hash<folly::Optional<T>> {
  size_t operator()(folly::Optional<T> const& obj) const {
    if (!obj.hasValue()) {
      return 0;
    }
    return hash<typename remove_const<T>::type>()(*obj);
  }
};
FOLLY_NAMESPACE_STD_END

// Enable the use of folly::Optional with `co_await`
// Inspired by https://github.com/toby-allsopp/coroutine_monad
#if FOLLY_HAS_COROUTINES
#include <folly/experimental/coro/Coroutine.h>

namespace folly {
namespace detail {
template <typename Value>
struct OptionalPromise;

template <typename Value>
struct OptionalPromiseReturn {
  Optional<Value> storage_;
  OptionalPromise<Value>* promise_;
  /* implicit */ OptionalPromiseReturn(OptionalPromise<Value>& promise) noexcept
      : promise_(&promise) {
    promise.value_ = &storage_;
  }
  OptionalPromiseReturn(OptionalPromiseReturn&& that) noexcept
      : OptionalPromiseReturn{*that.promise_} {}
  ~OptionalPromiseReturn() {}
  /* implicit */ operator Optional<Value>() & { return std::move(storage_); }
};

template <typename Value>
struct OptionalPromise {
  Optional<Value>* value_ = nullptr;
  OptionalPromise() = default;
  OptionalPromise(OptionalPromise const&) = delete;
  // This should work regardless of whether the compiler generates:
  //    folly::Optional<Value> retobj{ p.get_return_object(); } // MSVC
  // or:
  //    auto retobj = p.get_return_object(); // clang
  OptionalPromiseReturn<Value> get_return_object() noexcept { return *this; }
  coro::suspend_never initial_suspend() const noexcept { return {}; }
  coro::suspend_never final_suspend() const noexcept { return {}; }
  template <typename U = Value>
  void return_value(U&& u) {
    *value_ = static_cast<U&&>(u);
  }
  void unhandled_exception() {
    // Technically, throwing from unhandled_exception is underspecified:
    // https://github.com/GorNishanov/CoroutineWording/issues/17
    rethrow_current_exception();
  }
};

template <typename Value>
struct OptionalAwaitable {
  Optional<Value> o_;
  bool await_ready() const noexcept { return o_.hasValue(); }
  Value await_resume() { return std::move(o_.value()); }

  // Explicitly only allow suspension into an OptionalPromise
  template <typename U>
  void await_suspend(coro::coroutine_handle<OptionalPromise<U>> h) const {
    // Abort the rest of the coroutine. resume() is not going to be called
    h.destroy();
  }
};
} // namespace detail

template <typename Value>
detail::OptionalAwaitable<Value>
/* implicit */ operator co_await(Optional<Value> o) {
  return {std::move(o)};
}
} // namespace folly

#endif // FOLLY_HAS_COROUTINES
