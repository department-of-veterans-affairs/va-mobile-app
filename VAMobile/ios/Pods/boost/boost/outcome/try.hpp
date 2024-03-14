/* Try operation macros
(C) 2017-2023 Niall Douglas <http://www.nedproductions.biz/> (20 commits)
File Created: July 2017


Boost Software License - Version 1.0 - August 17th, 2003

Permission is hereby granted, free of charge, to any person or organization
obtaining a copy of the software and accompanying documentation covered by
this license (the "Software") to use, reproduce, display, distribute,
execute, and transmit the Software, and to prepare derivative works of the
Software, and to permit third-parties to whom the Software is furnished to
do so, all subject to the following:

The copyright notices in the Software and this entire statement, including
the above license grant, this restriction and the following disclaimer,
must be included in all copies of the Software, in whole or in part, and
all derivative works of the Software, unless such copies or derivative
works are solely in the form of machine-executable object code generated by
a source language processor.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT. IN NO EVENT
SHALL THE COPYRIGHT HOLDERS OR ANYONE DISTRIBUTING THE SOFTWARE BE LIABLE
FOR ANY DAMAGES OR OTHER LIABILITY, WHETHER IN CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
*/

#ifndef BOOST_OUTCOME_TRY_HPP
#define BOOST_OUTCOME_TRY_HPP

#include "success_failure.hpp"

BOOST_OUTCOME_V2_NAMESPACE_BEGIN

namespace detail
{
  struct has_value_overload
  {
  };
  struct as_failure_overload
  {
  };
  struct assume_error_overload
  {
  };
  struct error_overload
  {
  };
  struct assume_value_overload
  {
  };
  struct value_overload
  {
  };
  //#ifdef __APPLE__
  //  BOOST_OUTCOME_TEMPLATE(class T, class R = decltype(std::declval<T>()._xcode_workaround_as_failure()))
  //#else
  BOOST_OUTCOME_TEMPLATE(class T, class R = decltype(std::declval<T>().as_failure()))
  //#endif
  BOOST_OUTCOME_TREQUIRES(BOOST_OUTCOME_TPRED(BOOST_OUTCOME_V2_NAMESPACE::is_failure_type<R>))
  constexpr inline bool has_as_failure(int /*unused */) { return true; }
  template <class T> constexpr inline bool has_as_failure(...) { return false; }
  BOOST_OUTCOME_TEMPLATE(class T)
  BOOST_OUTCOME_TREQUIRES(BOOST_OUTCOME_TEXPR(std::declval<T>().assume_error()))
  constexpr inline bool has_assume_error(int /*unused */) { return true; }
  template <class T> constexpr inline bool has_assume_error(...) { return false; }
  BOOST_OUTCOME_TEMPLATE(class T)
  BOOST_OUTCOME_TREQUIRES(BOOST_OUTCOME_TEXPR(std::declval<T>().error()))
  constexpr inline bool has_error(int /*unused */) { return true; }
  template <class T> constexpr inline bool has_error(...) { return false; }
  BOOST_OUTCOME_TEMPLATE(class T)
  BOOST_OUTCOME_TREQUIRES(BOOST_OUTCOME_TEXPR(std::declval<T>().assume_value()))
  constexpr inline bool has_assume_value(int /*unused */) { return true; }
  template <class T> constexpr inline bool has_assume_value(...) { return false; }
  BOOST_OUTCOME_TEMPLATE(class T)
  BOOST_OUTCOME_TREQUIRES(BOOST_OUTCOME_TEXPR(std::declval<T>().value()))
  constexpr inline bool has_value(int /*unused */) { return true; }
  template <class T> constexpr inline bool has_value(...) { return false; }
}  // namespace detail

/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
BOOST_OUTCOME_TEMPLATE(class T)
BOOST_OUTCOME_TREQUIRES(BOOST_OUTCOME_TEXPR(std::declval<T>().has_value()))
constexpr inline bool try_operation_has_value(T &&v, detail::has_value_overload = {})
{
  return v.has_value();
}

/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
BOOST_OUTCOME_TEMPLATE(class T)
BOOST_OUTCOME_TREQUIRES(BOOST_OUTCOME_TPRED(detail::has_as_failure<T>(5)))
constexpr inline decltype(auto) try_operation_return_as(T &&v, detail::as_failure_overload = {})
{
  return static_cast<T &&>(v).as_failure();
}
/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
BOOST_OUTCOME_TEMPLATE(class T)
BOOST_OUTCOME_TREQUIRES(BOOST_OUTCOME_TPRED(!detail::has_as_failure<T>(5) && detail::has_assume_error<T>(5)))
constexpr inline decltype(auto) try_operation_return_as(T &&v, detail::assume_error_overload = {})
{
  return failure(static_cast<T &&>(v).assume_error());
}
/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
BOOST_OUTCOME_TEMPLATE(class T)
BOOST_OUTCOME_TREQUIRES(BOOST_OUTCOME_TPRED(!detail::has_as_failure<T>(5) && !detail::has_assume_error<T>(5) && detail::has_error<T>(5)))
constexpr inline decltype(auto) try_operation_return_as(T &&v, detail::error_overload = {})
{
  return failure(static_cast<T &&>(v).error());
}

/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
BOOST_OUTCOME_TEMPLATE(class T)
BOOST_OUTCOME_TREQUIRES(BOOST_OUTCOME_TPRED(detail::has_assume_value<T>(5)))
constexpr inline decltype(auto) try_operation_extract_value(T &&v, detail::assume_value_overload = {})
{
  return static_cast<T &&>(v).assume_value();
}
/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
BOOST_OUTCOME_TEMPLATE(class T)
BOOST_OUTCOME_TREQUIRES(BOOST_OUTCOME_TPRED(!detail::has_assume_value<T>(5) && detail::has_value<T>(5)))
constexpr inline decltype(auto) try_operation_extract_value(T &&v, detail::value_overload = {})
{
  return static_cast<T &&>(v).value();
}

BOOST_OUTCOME_V2_NAMESPACE_END

#if !defined(__clang__) && defined(__GNUC__) && __GNUC__ >= 8
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wparentheses"
#endif


#define BOOST_OUTCOME_TRY_GLUE2(x, y) x##y
#define BOOST_OUTCOME_TRY_GLUE(x, y) BOOST_OUTCOME_TRY_GLUE2(x, y)
#define BOOST_OUTCOME_TRY_UNIQUE_NAME BOOST_OUTCOME_TRY_GLUE(_outcome_try_unique_name_temporary, __COUNTER__)

#define BOOST_OUTCOME_TRY_RETURN_ARG_COUNT(_1_, _2_, _3_, _4_, _5_, _6_, _7_, _8_, count, ...) count
#define BOOST_OUTCOME_TRY_EXPAND_ARGS(args) BOOST_OUTCOME_TRY_RETURN_ARG_COUNT args
#define BOOST_OUTCOME_TRY_COUNT_ARGS_MAX8(...) BOOST_OUTCOME_TRY_EXPAND_ARGS((__VA_ARGS__, 8, 7, 6, 5, 4, 3, 2, 1, 0))
#define BOOST_OUTCOME_TRY_OVERLOAD_MACRO2(name, count) name##count
#define BOOST_OUTCOME_TRY_OVERLOAD_MACRO1(name, count) BOOST_OUTCOME_TRY_OVERLOAD_MACRO2(name, count)
#define BOOST_OUTCOME_TRY_OVERLOAD_MACRO(name, count) BOOST_OUTCOME_TRY_OVERLOAD_MACRO1(name, count)
#define BOOST_OUTCOME_TRY_OVERLOAD_GLUE(x, y) x y
#define BOOST_OUTCOME_TRY_CALL_OVERLOAD(name, ...)                                                                                                                   \
  BOOST_OUTCOME_TRY_OVERLOAD_GLUE(BOOST_OUTCOME_TRY_OVERLOAD_MACRO(name, BOOST_OUTCOME_TRY_COUNT_ARGS_MAX8(__VA_ARGS__)), (__VA_ARGS__))

#define _OUTCOME_TRY_RETURN_ARG_COUNT(_1_, _2_, _3_, _4_, _5_, _6_, _7_, _8_, count, ...) count
#define _OUTCOME_TRY_EXPAND_ARGS(args) _OUTCOME_TRY_RETURN_ARG_COUNT args
#define _OUTCOME_TRY_COUNT_ARGS_MAX8(...) _OUTCOME_TRY_EXPAND_ARGS((__VA_ARGS__, 8, 7, 6, 5, 4, 3, 2, 1, 0))
#define _OUTCOME_TRY_OVERLOAD_MACRO2(name, count) name##count
#define _OUTCOME_TRY_OVERLOAD_MACRO1(name, count) _OUTCOME_TRY_OVERLOAD_MACRO2(name, count)
#define _OUTCOME_TRY_OVERLOAD_MACRO(name, count) _OUTCOME_TRY_OVERLOAD_MACRO1(name, count)
#define _OUTCOME_TRY_OVERLOAD_GLUE(x, y) x y
#define _OUTCOME_TRY_CALL_OVERLOAD(name, ...)                                                                                                                  \
  _OUTCOME_TRY_OVERLOAD_GLUE(_OUTCOME_TRY_OVERLOAD_MACRO(name, _OUTCOME_TRY_COUNT_ARGS_MAX8(__VA_ARGS__)), (__VA_ARGS__))

#if !defined(BOOST_OUTCOME_TRY_LIKELY_IF) && defined(__has_cpp_attribute)
#if __has_cpp_attribute(likely)
#define BOOST_OUTCOME_TRY_LIKELY_IF(...) if(__VA_ARGS__) [[likely]]
#endif
#endif
#ifndef BOOST_OUTCOME_TRY_LIKELY_IF
#if defined(__clang__) || defined(__GNUC__)
#define BOOST_OUTCOME_TRY_LIKELY_IF(...) if(__builtin_expect(!!(__VA_ARGS__), true))
#else
#define BOOST_OUTCOME_TRY_LIKELY_IF(...) if(__VA_ARGS__)
#endif
#endif

#define BOOST_OUTCOME_TRYV2_UNIQUE_STORAGE_UNPACK(...) __VA_ARGS__
#define BOOST_OUTCOME_TRYV2_UNIQUE_STORAGE_DEDUCE3(unique, ...) auto unique = (__VA_ARGS__)
#define BOOST_OUTCOME_TRYV2_UNIQUE_STORAGE_DEDUCE2(x) x
#define BOOST_OUTCOME_TRYV2_UNIQUE_STORAGE_DEDUCE(unique, x, ...) BOOST_OUTCOME_TRYV2_UNIQUE_STORAGE_DEDUCE2(BOOST_OUTCOME_TRYV2_UNIQUE_STORAGE_DEDUCE3(unique, __VA_ARGS__))
#define BOOST_OUTCOME_TRYV2_UNIQUE_STORAGE_SPECIFIED3(unique, x, y, ...) x unique = (__VA_ARGS__)
#define BOOST_OUTCOME_TRYV2_UNIQUE_STORAGE_SPECIFIED2(x) x
#define BOOST_OUTCOME_TRYV2_UNIQUE_STORAGE_SPECIFIED(unique, ...)                                                                                                    \
  BOOST_OUTCOME_TRYV2_UNIQUE_STORAGE_SPECIFIED2(BOOST_OUTCOME_TRYV2_UNIQUE_STORAGE_SPECIFIED3(unique, __VA_ARGS__))
#define BOOST_OUTCOME_TRYV2_UNIQUE_STORAGE1(...) BOOST_OUTCOME_TRYV2_UNIQUE_STORAGE_DEDUCE
#define BOOST_OUTCOME_TRYV2_UNIQUE_STORAGE2(...) BOOST_OUTCOME_TRYV2_UNIQUE_STORAGE_SPECIFIED
#define BOOST_OUTCOME_TRYV2_UNIQUE_STORAGE(unique, spec, ...)                                                                                                        \
  _OUTCOME_TRY_CALL_OVERLOAD(BOOST_OUTCOME_TRYV2_UNIQUE_STORAGE, BOOST_OUTCOME_TRYV2_UNIQUE_STORAGE_UNPACK spec)                                                           \
  (unique, BOOST_OUTCOME_TRYV2_UNIQUE_STORAGE_UNPACK spec, __VA_ARGS__)

// Use if(!expr); else as some compilers assume else clauses are always unlikely
#define BOOST_OUTCOME_TRYV2_SUCCESS_LIKELY(unique, retstmt, spec, ...)                                                                                               \
  BOOST_OUTCOME_TRYV2_UNIQUE_STORAGE(unique, spec, __VA_ARGS__);                                                                                                     \
  BOOST_OUTCOME_TRY_LIKELY_IF(::BOOST_OUTCOME_V2_NAMESPACE::try_operation_has_value(unique));                                                                              \
  else                                                                                                                                                         \
  { /* works around ICE in GCC's coroutines implementation */                                                                                                  \
    auto unique##_f(::BOOST_OUTCOME_V2_NAMESPACE::try_operation_return_as(static_cast<decltype(unique) &&>(unique)));                                                \
    retstmt unique##_f;                                                                                                                                        \
  }
#define BOOST_OUTCOME_TRYV3_FAILURE_LIKELY(unique, retstmt, spec, ...)                                                                                               \
  BOOST_OUTCOME_TRYV2_UNIQUE_STORAGE(unique, spec, __VA_ARGS__);                                                                                                     \
  BOOST_OUTCOME_TRY_LIKELY_IF(!BOOST_OUTCOME_V2_NAMESPACE::try_operation_has_value(unique))                                                                                \
  { /* works around ICE in GCC's coroutines implementation */                                                                                                  \
    auto unique##_f(::BOOST_OUTCOME_V2_NAMESPACE::try_operation_return_as(static_cast<decltype(unique) &&>(unique)));                                                \
    retstmt unique##_f;                                                                                                                                        \
  }

#define BOOST_OUTCOME_TRY2_VAR_SECOND2(x, var) var
#define BOOST_OUTCOME_TRY2_VAR_SECOND3(x, y, ...) x y
#define BOOST_OUTCOME_TRY2_VAR(spec) _OUTCOME_TRY_CALL_OVERLOAD(BOOST_OUTCOME_TRY2_VAR_SECOND, BOOST_OUTCOME_TRYV2_UNIQUE_STORAGE_UNPACK spec, spec)
#define BOOST_OUTCOME_TRY2_SUCCESS_LIKELY(unique, retstmt, var, ...)                                                                                                 \
  BOOST_OUTCOME_TRYV2_SUCCESS_LIKELY(unique, retstmt, var, __VA_ARGS__);                                                                                             \
  BOOST_OUTCOME_TRY2_VAR(var) = ::BOOST_OUTCOME_V2_NAMESPACE::try_operation_extract_value(static_cast<decltype(unique) &&>(unique))
#define BOOST_OUTCOME_TRY2_FAILURE_LIKELY(unique, retstmt, var, ...)                                                                                                 \
  BOOST_OUTCOME_TRYV3_FAILURE_LIKELY(unique, retstmt, var, __VA_ARGS__);                                                                                             \
  BOOST_OUTCOME_TRY2_VAR(var) = ::BOOST_OUTCOME_V2_NAMESPACE::try_operation_extract_value(static_cast<decltype(unique) &&>(unique))

/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
#define BOOST_OUTCOME_TRYV(...) BOOST_OUTCOME_TRYV2_SUCCESS_LIKELY(BOOST_OUTCOME_TRY_UNIQUE_NAME, return, deduce, __VA_ARGS__)
/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
#define BOOST_OUTCOME_TRYV_FAILURE_LIKELY(...) BOOST_OUTCOME_TRYV3_FAILURE_LIKELY(BOOST_OUTCOME_TRY_UNIQUE_NAME, return, deduce, __VA_ARGS__)

/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
#define BOOST_OUTCOME_CO_TRYV(...) BOOST_OUTCOME_TRYV2_SUCCESS_LIKELY(BOOST_OUTCOME_TRY_UNIQUE_NAME, co_return, deduce, __VA_ARGS__)
/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
#define BOOST_OUTCOME_CO_TRYV_FAILURE_LIKELY(...) BOOST_OUTCOME_TRYV3_FAILURE_LIKELY(BOOST_OUTCOME_TRY_UNIQUE_NAME, co_return, deduce, __VA_ARGS__)

/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
#define BOOST_OUTCOME_TRYV2(s, ...) BOOST_OUTCOME_TRYV2_SUCCESS_LIKELY(BOOST_OUTCOME_TRY_UNIQUE_NAME, return, (s, ), __VA_ARGS__)
/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
#define BOOST_OUTCOME_TRYV2_FAILURE_LIKELY(s, ...) BOOST_OUTCOME_TRYV3_FAILURE_LIKELY(BOOST_OUTCOME_TRY_UNIQUE_NAME, return, (s, ), __VA_ARGS__)

/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
#define BOOST_OUTCOME_CO_TRYV2(s, ...) BOOST_OUTCOME_TRYV2_SUCCESS_LIKELY(BOOST_OUTCOME_TRY_UNIQUE_NAME, co_return, (s, ), __VA_ARGS__)
/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
#define BOOST_OUTCOME_CO_TRYV2_FAILURE_LIKELY(s, ...) BOOST_OUTCOME_TRYV3_FAILURE_LIKELY(BOOST_OUTCOME_TRY_UNIQUE_NAME, co_return, s(, ), __VA_ARGS__)


#if defined(__GNUC__) || defined(__clang__)

#define BOOST_OUTCOME_TRYX2(unique, retstmt, ...)                                                                                                                    \
  ({                                                                                                                                                           \
    BOOST_OUTCOME_TRYV2_SUCCESS_LIKELY(unique, retstmt, deduce, __VA_ARGS__);                                                                                        \
    ::BOOST_OUTCOME_V2_NAMESPACE::try_operation_extract_value(static_cast<decltype(unique) &&>(unique));                                                             \
  })

/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
#define BOOST_OUTCOME_TRYX(...) BOOST_OUTCOME_TRYX2(BOOST_OUTCOME_TRY_UNIQUE_NAME, return, __VA_ARGS__)

/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
#define BOOST_OUTCOME_CO_TRYX(...) BOOST_OUTCOME_TRYX2(BOOST_OUTCOME_TRY_UNIQUE_NAME, co_return, __VA_ARGS__)
#endif

/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
#define BOOST_OUTCOME_TRYA(v, ...) BOOST_OUTCOME_TRY2_SUCCESS_LIKELY(BOOST_OUTCOME_TRY_UNIQUE_NAME, return, v, __VA_ARGS__)
/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
#define BOOST_OUTCOME_TRYA_FAILURE_LIKELY(v, ...) BOOST_OUTCOME_TRY2_FAILURE_LIKELY(BOOST_OUTCOME_TRY_UNIQUE_NAME, return, v, __VA_ARGS__)

/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
#define BOOST_OUTCOME_CO_TRYA(v, ...) BOOST_OUTCOME_TRY2_SUCCESS_LIKELY(BOOST_OUTCOME_TRY_UNIQUE_NAME, co_return, v, __VA_ARGS__)
/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
#define BOOST_OUTCOME_CO_TRYA_FAILURE_LIKELY(v, ...) BOOST_OUTCOME_TRY2_FAILURE_LIKELY(BOOST_OUTCOME_TRY_UNIQUE_NAME, co_return, v, __VA_ARGS__)


#define BOOST_OUTCOME_TRY_INVOKE_TRY8(a, b, c, d, e, f, g, h) BOOST_OUTCOME_TRYA(a, b, c, d, e, f, g, h)
#define BOOST_OUTCOME_TRY_INVOKE_TRY7(a, b, c, d, e, f, g) BOOST_OUTCOME_TRYA(a, b, c, d, e, f, g)
#define BOOST_OUTCOME_TRY_INVOKE_TRY6(a, b, c, d, e, f) BOOST_OUTCOME_TRYA(a, b, c, d, e, f)
#define BOOST_OUTCOME_TRY_INVOKE_TRY5(a, b, c, d, e) BOOST_OUTCOME_TRYA(a, b, c, d, e)
#define BOOST_OUTCOME_TRY_INVOKE_TRY4(a, b, c, d) BOOST_OUTCOME_TRYA(a, b, c, d)
#define BOOST_OUTCOME_TRY_INVOKE_TRY3(a, b, c) BOOST_OUTCOME_TRYA(a, b, c)
#define BOOST_OUTCOME_TRY_INVOKE_TRY2(a, b) BOOST_OUTCOME_TRYA(a, b)
#define BOOST_OUTCOME_TRY_INVOKE_TRY1(a) BOOST_OUTCOME_TRYV(a)

/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
#define BOOST_OUTCOME_TRY(...) BOOST_OUTCOME_TRY_CALL_OVERLOAD(BOOST_OUTCOME_TRY_INVOKE_TRY, __VA_ARGS__)

#define BOOST_OUTCOME_TRY_FAILURE_LIKELY_INVOKE_TRY8(a, b, c, d, e, f, g, h) BOOST_OUTCOME_TRYA_FAILURE_LIKELY(a, b, c, d, e, f, g, h)
#define BOOST_OUTCOME_TRY_FAILURE_LIKELY_INVOKE_TRY7(a, b, c, d, e, f, g) BOOST_OUTCOME_TRYA_FAILURE_LIKELY(a, b, c, d, e, f, g)
#define BOOST_OUTCOME_TRY_FAILURE_LIKELY_INVOKE_TRY6(a, b, c, d, e, f) BOOST_OUTCOME_TRYA_FAILURE_LIKELY(a, b, c, d, e, f)
#define BOOST_OUTCOME_TRY_FAILURE_LIKELY_INVOKE_TRY5(a, b, c, d, e) BOOST_OUTCOME_TRYA_FAILURE_LIKELY(a, b, c, d, e)
#define BOOST_OUTCOME_TRY_FAILURE_LIKELY_INVOKE_TRY4(a, b, c, d) BOOST_OUTCOME_TRYA_FAILURE_LIKELY(a, b, c, d)
#define BOOST_OUTCOME_TRY_FAILURE_LIKELY_INVOKE_TRY3(a, b, c) BOOST_OUTCOME_TRYA_FAILURE_LIKELY(a, b, c)
#define BOOST_OUTCOME_TRY_FAILURE_LIKELY_INVOKE_TRY2(a, b) BOOST_OUTCOME_TRYA_FAILURE_LIKELY(a, b)
#define BOOST_OUTCOME_TRY_FAILURE_LIKELY_INVOKE_TRY1(a) BOOST_OUTCOME_TRYV_FAILURE_LIKELY(a)
/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
#define BOOST_OUTCOME_TRY_FAILURE_LIKELY(...) BOOST_OUTCOME_TRY_CALL_OVERLOAD(BOOST_OUTCOME_TRY_FAILURE_LIKELY_INVOKE_TRY, __VA_ARGS__)

#define BOOST_OUTCOME_CO_TRY_INVOKE_TRY8(a, b, c, d, e, f, g, h) BOOST_OUTCOME_CO_TRYA(a, b, c, d, e, f, g, h)
#define BOOST_OUTCOME_CO_TRY_INVOKE_TRY7(a, b, c, d, e, f, g) BOOST_OUTCOME_CO_TRYA(a, b, c, d, e, f, g)
#define BOOST_OUTCOME_CO_TRY_INVOKE_TRY6(a, b, c, d, e, f) BOOST_OUTCOME_CO_TRYA(a, b, c, d, e, f)
#define BOOST_OUTCOME_CO_TRY_INVOKE_TRY5(a, b, c, d, e) BOOST_OUTCOME_CO_TRYA(a, b, c, d, e)
#define BOOST_OUTCOME_CO_TRY_INVOKE_TRY4(a, b, c, d) BOOST_OUTCOME_CO_TRYA(a, b, c, d)
#define BOOST_OUTCOME_CO_TRY_INVOKE_TRY3(a, b, c) BOOST_OUTCOME_CO_TRYA(a, b, c)
#define BOOST_OUTCOME_CO_TRY_INVOKE_TRY2(a, b) BOOST_OUTCOME_CO_TRYA(a, b)
#define BOOST_OUTCOME_CO_TRY_INVOKE_TRY1(a) BOOST_OUTCOME_CO_TRYV(a)
/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
#define BOOST_OUTCOME_CO_TRY(...) BOOST_OUTCOME_TRY_CALL_OVERLOAD(BOOST_OUTCOME_CO_TRY_INVOKE_TRY, __VA_ARGS__)

/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
#define BOOST_OUTCOME_TRY(...) BOOST_OUTCOME_TRY_CALL_OVERLOAD(BOOST_OUTCOME_TRY_INVOKE_TRY, __VA_ARGS__)

#define BOOST_OUTCOME_CO_TRY_FAILURE_LIKELY_INVOKE_TRY8(a, b, c, d, e, f, g, h) BOOST_OUTCOME_CO_TRYA_FAILURE_LIKELY(a, b, c, d, e, f, g, h)
#define BOOST_OUTCOME_CO_TRY_FAILURE_LIKELY_INVOKE_TRY7(a, b, c, d, e, f, g) BOOST_OUTCOME_CO_TRYA_FAILURE_LIKELY(a, b, c, d, e, f, g)
#define BOOST_OUTCOME_CO_TRY_FAILURE_LIKELY_INVOKE_TRY6(a, b, c, d, e, f) BOOST_OUTCOME_CO_TRYA_FAILURE_LIKELY(a, b, c, d, e, f)
#define BOOST_OUTCOME_CO_TRY_FAILURE_LIKELY_INVOKE_TRY5(a, b, c, d, e) BOOST_OUTCOME_CO_TRYA_FAILURE_LIKELY(a, b, c, d, e)
#define BOOST_OUTCOME_CO_TRY_FAILURE_LIKELY_INVOKE_TRY4(a, b, c, d) BOOST_OUTCOME_CO_TRYA_FAILURE_LIKELY(a, b, c, d)
#define BOOST_OUTCOME_CO_TRY_FAILURE_LIKELY_INVOKE_TRY3(a, b, c) BOOST_OUTCOME_CO_TRYA_FAILURE_LIKELY(a, b, c)
#define BOOST_OUTCOME_CO_TRY_FAILURE_LIKELY_INVOKE_TRY2(a, b) BOOST_OUTCOME_CO_TRYA_FAILURE_LIKELY(a, b)
#define BOOST_OUTCOME_CO_TRY_FAILURE_LIKELY_INVOKE_TRY1(a) BOOST_OUTCOME_CO_TRYV_FAILURE_LIKELY(a)
/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
#define BOOST_OUTCOME_CO_TRY_FAILURE_LIKELY(...) BOOST_OUTCOME_TRY_CALL_OVERLOAD(BOOST_OUTCOME_CO_TRY_FAILURE_LIKELY_INVOKE_TRY, __VA_ARGS__)


/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
#define OUTCOME21_TRYA(v, ...) BOOST_OUTCOME_TRY2_SUCCESS_LIKELY(BOOST_OUTCOME_TRY_UNIQUE_NAME, return, deduce, auto &&v, __VA_ARGS__)
/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
#define OUTCOME21_TRYA_FAILURE_LIKELY(v, ...) BOOST_OUTCOME_TRY2_FAILURE_LIKELY(BOOST_OUTCOME_TRY_UNIQUE_NAME, return, deduce, auto &&v, __VA_ARGS__)

/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
#define OUTCOME21_CO_TRYA(v, ...) BOOST_OUTCOME_TRY2_FAILURE_LIKELY(BOOST_OUTCOME_TRY_UNIQUE_NAME, co_return, deduce, auto &&v, __VA_ARGS__)
/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
#define OUTCOME21_CO_TRYA_FAILURE_LIKELY(v, ...) BOOST_OUTCOME_TRY2_FAILURE_LIKELY(BOOST_OUTCOME_TRY_UNIQUE_NAME, co_retrn, deduce, auto &&v, __VA_ARGS__)


#define OUTCOME21_TRY_INVOKE_TRY8(a, b, c, d, e, f, g, h) OUTCOME21_TRYA(a, b, c, d, e, f, g, h)
#define OUTCOME21_TRY_INVOKE_TRY7(a, b, c, d, e, f, g) OUTCOME21_TRYA(a, b, c, d, e, f, g)
#define OUTCOME21_TRY_INVOKE_TRY6(a, b, c, d, e, f) OUTCOME21_TRYA(a, b, c, d, e, f)
#define OUTCOME21_TRY_INVOKE_TRY5(a, b, c, d, e) OUTCOME21_TRYA(a, b, c, d, e)
#define OUTCOME21_TRY_INVOKE_TRY4(a, b, c, d) OUTCOME21_TRYA(a, b, c, d)
#define OUTCOME21_TRY_INVOKE_TRY3(a, b, c) OUTCOME21_TRYA(a, b, c)
#define OUTCOME21_TRY_INVOKE_TRY2(a, b) OUTCOME21_TRYA(a, b)
#define OUTCOME21_TRY_INVOKE_TRY1(a) BOOST_OUTCOME_TRYV(a)

/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
#define OUTCOME21_TRY(...) BOOST_OUTCOME_TRY_CALL_OVERLOAD(OUTCOME21_TRY_INVOKE_TRY, __VA_ARGS__)

#define OUTCOME21_TRY_FAILURE_LIKELY_INVOKE_TRY8(a, b, c, d, e, f, g, h) OUTCOME21_TRYA_FAILURE_LIKELY(a, b, c, d, e, f, g, h)
#define OUTCOME21_TRY_FAILURE_LIKELY_INVOKE_TRY7(a, b, c, d, e, f, g) OUTCOME21_TRYA_FAILURE_LIKELY(a, b, c, d, e, f, g)
#define OUTCOME21_TRY_FAILURE_LIKELY_INVOKE_TRY6(a, b, c, d, e, f) OUTCOME21_TRYA_FAILURE_LIKELY(a, b, c, d, e, f)
#define OUTCOME21_TRY_FAILURE_LIKELY_INVOKE_TRY5(a, b, c, d, e) OUTCOME21_TRYA_FAILURE_LIKELY(a, b, c, d, e)
#define OUTCOME21_TRY_FAILURE_LIKELY_INVOKE_TRY4(a, b, c, d) OUTCOME21_TRYA_FAILURE_LIKELY(a, b, c, d)
#define OUTCOME21_TRY_FAILURE_LIKELY_INVOKE_TRY3(a, b, c) OUTCOME21_TRYA_FAILURE_LIKELY(a, b, c)
#define OUTCOME21_TRY_FAILURE_LIKELY_INVOKE_TRY2(a, b) OUTCOME21_TRYA_FAILURE_LIKELY(a, b)
#define OUTCOME21_TRY_FAILURE_LIKELY_INVOKE_TRY1(a) BOOST_OUTCOME_TRYV_FAILURE_LIKELY(a)
/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
#define OUTCOME21_TRY_FAILURE_LIKELY(...) BOOST_OUTCOME_TRY_CALL_OVERLOAD(OUTCOME21_TRY_FAILURE_LIKELY_INVOKE_TRY, __VA_ARGS__)

#define OUTCOME21_CO_TRY_INVOKE_TRY8(a, b, c, d, e, f, g, h) OUTCOME21_CO_TRYA(a, b, c, d, e, f, g, h)
#define OUTCOME21_CO_TRY_INVOKE_TRY7(a, b, c, d, e, f, g) OUTCOME21_CO_TRYA(a, b, c, d, e, f, g)
#define OUTCOME21_CO_TRY_INVOKE_TRY6(a, b, c, d, e, f) OUTCOME21_CO_TRYA(a, b, c, d, e, f)
#define OUTCOME21_CO_TRY_INVOKE_TRY5(a, b, c, d, e) OUTCOME21_CO_TRYA(a, b, c, d, e)
#define OUTCOME21_CO_TRY_INVOKE_TRY4(a, b, c, d) OUTCOME21_CO_TRYA(a, b, c, d)
#define OUTCOME21_CO_TRY_INVOKE_TRY3(a, b, c) OUTCOME21_CO_TRYA(a, b, c)
#define OUTCOME21_CO_TRY_INVOKE_TRY2(a, b) OUTCOME21_CO_TRYA(a, b)
#define OUTCOME21_CO_TRY_INVOKE_TRY1(a) BOOST_OUTCOME_CO_TRYV(a)
/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
#define OUTCOME21_CO_TRY(...) BOOST_OUTCOME_TRY_CALL_OVERLOAD(OUTCOME21_CO_TRY_INVOKE_TRY, __VA_ARGS__)

#define OUTCOME21_CO_TRY_FAILURE_LIKELY_INVOKE_TRY8(a, b, c, d, e, f, g, h) OUTCOME21_CO_TRYA_FAILURE_LIKELY(a, b, c, d, e, f, g, h)
#define OUTCOME21_CO_TRY_FAILURE_LIKELY_INVOKE_TRY7(a, b, c, d, e, f, g) OUTCOME21_CO_TRYA_FAILURE_LIKELY(a, b, c, d, e, f, g)
#define OUTCOME21_CO_TRY_FAILURE_LIKELY_INVOKE_TRY6(a, b, c, d, e, f) OUTCOME21_CO_TRYA_FAILURE_LIKELY(a, b, c, d, e, f)
#define OUTCOME21_CO_TRY_FAILURE_LIKELY_INVOKE_TRY5(a, b, c, d, e) OUTCOME21_CO_TRYA_FAILURE_LIKELY(a, b, c, d, e)
#define OUTCOME21_CO_TRY_FAILURE_LIKELY_INVOKE_TRY4(a, b, c, d) OUTCOME21_CO_TRYA_FAILURE_LIKELY(a, b, c, d)
#define OUTCOME21_CO_TRY_FAILURE_LIKELY_INVOKE_TRY3(a, b, c) OUTCOME21_CO_TRYA_FAILURE_LIKELY(a, b, c)
#define OUTCOME21_CO_TRY_FAILURE_LIKELY_INVOKE_TRY2(a, b) OUTCOME21_CO_TRYA_FAILURE_LIKELY(a, b)
#define OUTCOME21_CO_TRY_FAILURE_LIKELY_INVOKE_TRY1(a) BOOST_OUTCOME_CO_TRYV_FAILURE_LIKELY(a)
/*! AWAITING HUGO JSON CONVERSION TOOL
SIGNATURE NOT RECOGNISED
*/
#define OUTCOME21_CO_TRY_FAILURE_LIKELY(...) BOOST_OUTCOME_TRY_CALL_OVERLOAD(OUTCOME21_CO_TRY_FAILURE_LIKELY_INVOKE_TRY, __VA_ARGS__)


#if !defined(__clang__) && defined(__GNUC__) && __GNUC__ >= 8
#pragma GCC diagnostic pop
#endif

#endif
