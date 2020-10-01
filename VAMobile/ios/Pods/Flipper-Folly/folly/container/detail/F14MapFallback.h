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

/**
 * This file is intended to be included only by F14Map.h. It contains fallback
 * implementations of F14Map types for platforms that do not support the
 * required SIMD instructions, based on std::unordered_map.
 */

#include <unordered_map>

namespace folly {

namespace f14 {
namespace detail {
template <typename K, typename M, typename H, typename E, typename A>
class F14BasicMap : public std::unordered_map<K, M, H, E, A> {
  using Super = std::unordered_map<K, M, H, E, A>;

 public:
  using typename Super::pointer;
  using typename Super::value_type;

  F14BasicMap() = default;

  using Super::Super;

  //// PUBLIC - F14 Extensions

  bool containsEqualValue(value_type const& value) const {
    auto slot = this->bucket(value.first);
    auto e = this->end(slot);
    for (auto b = this->begin(slot); b != e; ++b) {
      if (b->first == value.first) {
        return b->second == value.second;
      }
    }
    return false;
  }

  // exact for libstdc++, approximate for others
  std::size_t getAllocatedMemorySize() const {
    std::size_t rv = 0;
    visitAllocationClasses(
        [&](std::size_t bytes, std::size_t n) { rv += bytes * n; });
    return rv;
  }

  // exact for libstdc++, approximate for others
  template <typename V>
  void visitAllocationClasses(V&& visitor) const {
    auto bc = this->bucket_count();
    if (bc > 1) {
      visitor(bc * sizeof(pointer), 1);
    }
    if (this->size() > 0) {
      visitor(sizeof(StdNodeReplica<K, value_type, H>), this->size());
    }
  }

  template <typename V>
  void visitContiguousRanges(V&& visitor) const {
    for (value_type const& entry : *this) {
      value_type const* b = std::addressof(entry);
      visitor(b, b + 1);
    }
  }
};
} // namespace detail
} // namespace f14

template <
    typename Key,
    typename Mapped,
    typename Hasher,
    typename KeyEqual,
    typename Alloc>
class F14ValueMap
    : public f14::detail::F14BasicMap<Key, Mapped, Hasher, KeyEqual, Alloc> {
  using Super = f14::detail::F14BasicMap<Key, Mapped, Hasher, KeyEqual, Alloc>;

 public:
  using typename Super::value_type;

  F14ValueMap() = default;

  using Super::Super;

  F14ValueMap& operator=(std::initializer_list<value_type> ilist) {
    Super::operator=(ilist);
    return *this;
  }
};

template <
    typename Key,
    typename Mapped,
    typename Hasher,
    typename KeyEqual,
    typename Alloc>
class F14NodeMap
    : public f14::detail::F14BasicMap<Key, Mapped, Hasher, KeyEqual, Alloc> {
  using Super = f14::detail::F14BasicMap<Key, Mapped, Hasher, KeyEqual, Alloc>;

 public:
  using typename Super::value_type;

  F14NodeMap() = default;

  using Super::Super;

  F14NodeMap& operator=(std::initializer_list<value_type> ilist) {
    Super::operator=(ilist);
    return *this;
  }
};

template <
    typename Key,
    typename Mapped,
    typename Hasher,
    typename KeyEqual,
    typename Alloc>
class F14VectorMap
    : public f14::detail::F14BasicMap<Key, Mapped, Hasher, KeyEqual, Alloc> {
  using Super = f14::detail::F14BasicMap<Key, Mapped, Hasher, KeyEqual, Alloc>;

 public:
  using typename Super::value_type;

  F14VectorMap() = default;

  using Super::Super;

  F14VectorMap& operator=(std::initializer_list<value_type> ilist) {
    Super::operator=(ilist);
    return *this;
  }
};

template <
    typename Key,
    typename Mapped,
    typename Hasher,
    typename KeyEqual,
    typename Alloc>
class F14FastMap
    : public f14::detail::F14BasicMap<Key, Mapped, Hasher, KeyEqual, Alloc> {
  using Super = f14::detail::F14BasicMap<Key, Mapped, Hasher, KeyEqual, Alloc>;

 public:
  using typename Super::value_type;

  F14FastMap() = default;

  using Super::Super;

  F14FastMap& operator=(std::initializer_list<value_type> ilist) {
    Super::operator=(ilist);
    return *this;
  }
};

} // namespace folly
