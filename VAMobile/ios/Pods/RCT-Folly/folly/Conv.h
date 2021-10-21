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

/**
 *
 * This file provides a generic interface for converting objects to and from
 * string-like types (std::string, fbstring, StringPiece), as well as
 * range-checked conversions between numeric and enum types. The mechanisms are
 * extensible, so that user-specified types can add folly::to support.
 *
 *******************************************************************************
 * TYPE -> STRING CONVERSIONS
 *******************************************************************************
 * You can call the to<std::string> or to<fbstring>. These are variadic
 * functions that convert their arguments to strings, and concatenate them to
 * form a result. So, for example,
 *
 * auto str = to<std::string>(123, "456", 789);
 *
 * Sets str to "123456789".
 *
 * In addition to just concatenating the arguments, related functions can
 * delimit them with some string: toDelim<std::string>(",", "123", 456, "789")
 * will return the string "123,456,789".
 *
 * toAppend does not return a string; instead, it takes a pointer to a string as
 * its last argument, and appends the result of the concatenation into it:
 * std::string str = "123";
 * toAppend(456, "789", &str); // Now str is "123456789".
 *
 * The toAppendFit function acts like toAppend, but it precalculates the size
 * required to perform the append operation, and reserves that space in the
 * output string before actually inserting its arguments. This can sometimes
 * save on string expansion, but beware: appending to the same string many times
 * with toAppendFit is likely a pessimization, since it will resize the string
 * once per append.
 *
 * The combination of the append and delim variants also exist: toAppendDelim
 * and toAppendDelimFit are defined, with the obvious semantics.
 *
 *******************************************************************************
 * STRING -> TYPE CONVERSIONS
 *******************************************************************************
 * Going in the other direction, and parsing a string into a C++ type, is also
 * supported:
 * to<int>("123"); // Returns 123.
 *
 * Out of range (e.g. to<std::uint8_t>("1000")), or invalidly formatted (e.g.
 * to<int>("four")) inputs will throw. If throw-on-error is undesirable (for
 * instance: you're dealing with untrusted input, and want to protect yourself
 * from users sending you down a very slow exception-throwing path), you can use
 * tryTo<T>, which will return an Expected<T, ConversionCode>.
 *
 * There are overloads of to() and tryTo() that take a StringPiece*. These parse
 * out a type from the beginning of a string, and modify the passed-in
 * StringPiece to indicate the portion of the string not consumed.
 *
 *******************************************************************************
 * NUMERIC / ENUM CONVERSIONS
 *******************************************************************************
 * Conv also supports a to<T>(S) overload, where T and S are numeric or enum
 * types, that checks to see that the target type can represent its argument,
 * and will throw if it cannot. This includes cases where a floating point ->
 * integral conversion is attempted on a value with a non-zero fractional
 * component, and integral -> floating point conversions that would lose
 * precision. Enum conversions are range-checked for the underlying type of the
 * enum, but there is no check that the input value is a valid choice of enum
 * value.
 *
 *******************************************************************************
 * CUSTOM TYPE CONVERSIONS
 *******************************************************************************
 * Users may customize the string conversion functionality for their own data
 * types, . The key functions you should implement are:
 * // Two functions to allow conversion to your type from a string.
 * Expected<StringPiece, ConversionCode> parseTo(folly::StringPiece in,
 *     YourType& out);
 * YourErrorType makeConversionError(YourErrorType in, StringPiece in);
 * // Two functions to allow conversion from your type to a string.
 * template <class String>
 * void toAppend(const YourType& in, String* out);
 * size_t estimateSpaceNeeded(const YourType& in);
 *
 * These are documented below, inline.
 */

#pragma once

#include <algorithm>
#include <cassert>
#include <cctype>
#include <climits>
#include <cstddef>
#include <limits>
#include <stdexcept>
#include <string>
#include <tuple>
#include <type_traits>
#include <utility>

#include <double-conversion/double-conversion.h> // V8 JavaScript implementation

#include <folly/Demangle.h>
#include <folly/Expected.h>
#include <folly/FBString.h>
#include <folly/Likely.h>
#include <folly/Range.h>
#include <folly/Traits.h>
#include <folly/Unit.h>
#include <folly/Utility.h>
#include <folly/lang/Exception.h>
#include <folly/lang/Pretty.h>
#include <folly/lang/ToAscii.h>
#include <folly/portability/Math.h>

namespace folly {

// Keep this in sync with kErrorStrings in Conv.cpp
enum class ConversionCode : unsigned char {
  SUCCESS,
  EMPTY_INPUT_STRING,
  NO_DIGITS,
  BOOL_OVERFLOW,
  BOOL_INVALID_VALUE,
  NON_DIGIT_CHAR,
  INVALID_LEADING_CHAR,
  POSITIVE_OVERFLOW,
  NEGATIVE_OVERFLOW,
  STRING_TO_FLOAT_ERROR,
  NON_WHITESPACE_AFTER_END,
  ARITH_POSITIVE_OVERFLOW,
  ARITH_NEGATIVE_OVERFLOW,
  ARITH_LOSS_OF_PRECISION,
  NUM_ERROR_CODES, // has to be the last entry
};

struct ConversionErrorBase : std::range_error {
  using std::range_error::range_error;
};

class ConversionError : public ConversionErrorBase {
 public:
  ConversionError(const std::string& str, ConversionCode code)
      : ConversionErrorBase(str), code_(code) {}

  ConversionError(const char* str, ConversionCode code)
      : ConversionErrorBase(str), code_(code) {}

  ConversionCode errorCode() const { return code_; }

 private:
  ConversionCode code_;
};

/*******************************************************************************
 * Custom Error Translation
 *
 * Your overloaded parseTo() function can return a custom error code on failure.
 * ::folly::to() will call makeConversionError to translate that error code into
 * an object to throw. makeConversionError is found by argument-dependent
 * lookup. It should have this signature:
 *
 * namespace other_namespace {
 * enum YourErrorCode { BAD_ERROR, WORSE_ERROR };
 *
 * struct YourConversionError : ConversionErrorBase {
 *   YourConversionError(const char* what) : ConversionErrorBase(what) {}
 * };
 *
 * YourConversionError
 * makeConversionError(YourErrorCode code, ::folly::StringPiece sp) {
 *   ...
 *   return YourConversionError(messageString);
 * }
 ******************************************************************************/
ConversionError makeConversionError(ConversionCode code, StringPiece input);

namespace detail {
/**
 * Enforce that the suffix following a number is made up only of whitespace.
 */
inline ConversionCode enforceWhitespaceErr(StringPiece sp) {
  for (auto c : sp) {
    if (UNLIKELY(!std::isspace(c))) {
      return ConversionCode::NON_WHITESPACE_AFTER_END;
    }
  }
  return ConversionCode::SUCCESS;
}

/**
 * Keep this implementation around for prettyToDouble().
 */
inline void enforceWhitespace(StringPiece sp) {
  auto err = enforceWhitespaceErr(sp);
  if (err != ConversionCode::SUCCESS) {
    throw_exception(makeConversionError(err, sp));
  }
}
} // namespace detail

/**
 * The identity conversion function.
 * tryTo<T>(T) returns itself for all types T.
 */
template <class Tgt, class Src>
typename std::enable_if<
    std::is_same<Tgt, typename std::decay<Src>::type>::value,
    Expected<Tgt, ConversionCode>>::type
tryTo(Src&& value) {
  return std::forward<Src>(value);
}

template <class Tgt, class Src>
typename std::enable_if<
    std::is_same<Tgt, typename std::decay<Src>::type>::value,
    Tgt>::type
to(Src&& value) {
  return std::forward<Src>(value);
}

/*******************************************************************************
 * Arithmetic to boolean
 ******************************************************************************/

/**
 * Unchecked conversion from arithmetic to boolean. This is different from the
 * other arithmetic conversions because we use the C convention of treating any
 * non-zero value as true, instead of range checking.
 */
template <class Tgt, class Src>
typename std::enable_if<
    is_arithmetic_v<Src> && !std::is_same<Tgt, Src>::value &&
        std::is_same<Tgt, bool>::value,
    Expected<Tgt, ConversionCode>>::type
tryTo(const Src& value) {
  return value != Src();
}

template <class Tgt, class Src>
typename std::enable_if<
    is_arithmetic_v<Src> && !std::is_same<Tgt, Src>::value &&
        std::is_same<Tgt, bool>::value,
    Tgt>::type
to(const Src& value) {
  return value != Src();
}

/*******************************************************************************
 * Anything to string
 ******************************************************************************/

namespace detail {

#ifdef _MSC_VER
// MSVC can't quite figure out the LastElementImpl::call() stuff
// in the base implementation, so we have to use tuples instead,
// which result in significantly more templates being compiled,
// though the runtime performance is the same.

template <typename... Ts>
auto getLastElement(Ts&&... ts) -> decltype(std::get<sizeof...(Ts) - 1>(
    std::forward_as_tuple(std::forward<Ts>(ts)...))) {
  return std::get<sizeof...(Ts) - 1>(
      std::forward_as_tuple(std::forward<Ts>(ts)...));
}

inline void getLastElement() {}

template <size_t size, typename... Ts>
struct LastElementType : std::tuple_element<size - 1, std::tuple<Ts...>> {};

template <>
struct LastElementType<0> {
  using type = void;
};

template <class... Ts>
struct LastElement
    : std::decay<typename LastElementType<sizeof...(Ts), Ts...>::type> {};
#else
template <typename... Ts>
struct LastElementImpl {
  static void call(Ignored<Ts>...) {}
};

template <typename Head, typename... Ts>
struct LastElementImpl<Head, Ts...> {
  template <typename Last>
  static Last call(Ignored<Ts>..., Last&& last) {
    return std::forward<Last>(last);
  }
};

template <typename... Ts>
auto getLastElement(const Ts&... ts)
    -> decltype(LastElementImpl<Ts...>::call(ts...)) {
  return LastElementImpl<Ts...>::call(ts...);
}

template <class... Ts>
struct LastElement : std::decay<decltype(LastElementImpl<Ts...>::call(
                         std::declval<Ts>()...))> {};
#endif

} // namespace detail

/*******************************************************************************
 * Conversions from integral types to string types.
 ******************************************************************************/

#if FOLLY_HAVE_INT128_T
namespace detail {

template <typename IntegerType>
constexpr unsigned int digitsEnough() {
  // digits10 returns the number of decimal digits that this type can represent,
  // not the number of characters required for the max value, so we need to add
  // one. ex: char digits10 returns 2, because 256-999 cannot be represented,
  // but we need 3.
  auto const digits10 = std::numeric_limits<IntegerType>::digits10;
  return static_cast<unsigned int>(digits10) + 1;
}

inline size_t unsafeTelescope128(
    char* buffer, size_t room, unsigned __int128 x) {
  typedef unsigned __int128 Usrc;
  size_t p = room - 1;

  while (x >= (Usrc(1) << 64)) { // Using 128-bit division while needed
    const auto y = x / 10;
    const auto digit = x % 10;

    buffer[p--] = static_cast<char>('0' + digit);
    x = y;
  }

  uint64_t xx = static_cast<uint64_t>(x); // Rest uses faster 64-bit division

  while (xx >= 10) {
    const auto y = xx / 10ULL;
    const auto digit = xx % 10ULL;

    buffer[p--] = static_cast<char>('0' + digit);
    xx = y;
  }

  buffer[p] = static_cast<char>('0' + xx);

  return p;
}

} // namespace detail
#endif

/**
 * A single char gets appended.
 */
template <class Tgt>
void toAppend(char value, Tgt* result) {
  *result += value;
}

template <class T>
constexpr typename std::enable_if<std::is_same<T, char>::value, size_t>::type
estimateSpaceNeeded(T) {
  return 1;
}

template <size_t N>
constexpr size_t estimateSpaceNeeded(const char (&)[N]) {
  return N;
}

/**
 * Everything implicitly convertible to const char* gets appended.
 */
template <class Tgt, class Src>
typename std::enable_if<
    std::is_convertible<Src, const char*>::value &&
    IsSomeString<Tgt>::value>::type
toAppend(Src value, Tgt* result) {
  // Treat null pointers like an empty string, as in:
  // operator<<(std::ostream&, const char*).
  const char* c = value;
  if (c) {
    result->append(value);
  }
}

template <class Src>
typename std::enable_if<std::is_convertible<Src, const char*>::value, size_t>::
    type
    estimateSpaceNeeded(Src value) {
  const char* c = value;
  if (c) {
    return folly::StringPiece(value).size();
  };
  return 0;
}

template <class Src>
typename std::enable_if<IsSomeString<Src>::value, size_t>::type
estimateSpaceNeeded(Src const& value) {
  return value.size();
}

template <class Src>
typename std::enable_if<
    std::is_convertible<Src, folly::StringPiece>::value &&
        !IsSomeString<Src>::value &&
        !std::is_convertible<Src, const char*>::value,
    size_t>::type
estimateSpaceNeeded(Src value) {
  return folly::StringPiece(value).size();
}

template <>
inline size_t estimateSpaceNeeded(std::nullptr_t /* value */) {
  return 0;
}

template <class Src>
typename std::enable_if<
    std::is_pointer<Src>::value &&
        IsSomeString<std::remove_pointer<Src>>::value,
    size_t>::type
estimateSpaceNeeded(Src value) {
  return value->size();
}

/**
 * Strings get appended, too.
 */
template <class Tgt, class Src>
typename std::enable_if<
    IsSomeString<Src>::value && IsSomeString<Tgt>::value>::type
toAppend(const Src& value, Tgt* result) {
  result->append(value);
}

/**
 * and StringPiece objects too
 */
template <class Tgt>
typename std::enable_if<IsSomeString<Tgt>::value>::type toAppend(
    StringPiece value, Tgt* result) {
  result->append(value.data(), value.size());
}

/**
 * There's no implicit conversion from fbstring to other string types,
 * so make a specialization.
 */
template <class Tgt>
typename std::enable_if<IsSomeString<Tgt>::value>::type toAppend(
    const fbstring& value, Tgt* result) {
  result->append(value.data(), value.size());
}

#if FOLLY_HAVE_INT128_T
/**
 * Special handling for 128 bit integers.
 */

template <class Tgt>
void toAppend(__int128 value, Tgt* result) {
  typedef unsigned __int128 Usrc;
  char buffer[detail::digitsEnough<unsigned __int128>() + 1];
  size_t p;

  if (value < 0) {
    p = detail::unsafeTelescope128(buffer, sizeof(buffer), -Usrc(value));
    buffer[--p] = '-';
  } else {
    p = detail::unsafeTelescope128(buffer, sizeof(buffer), value);
  }

  result->append(buffer + p, buffer + sizeof(buffer));
}

template <class Tgt>
void toAppend(unsigned __int128 value, Tgt* result) {
  char buffer[detail::digitsEnough<unsigned __int128>()];
  size_t p;

  p = detail::unsafeTelescope128(buffer, sizeof(buffer), value);

  result->append(buffer + p, buffer + sizeof(buffer));
}

template <class T>
constexpr
    typename std::enable_if<std::is_same<T, __int128>::value, size_t>::type
    estimateSpaceNeeded(T) {
  return detail::digitsEnough<__int128>();
}

template <class T>
constexpr typename std::
    enable_if<std::is_same<T, unsigned __int128>::value, size_t>::type
    estimateSpaceNeeded(T) {
  return detail::digitsEnough<unsigned __int128>();
}

#endif

/**
 * int32_t and int64_t to string (by appending) go through here. The
 * result is APPENDED to a preexisting string passed as the second
 * parameter. This should be efficient with fbstring because fbstring
 * incurs no dynamic allocation below 23 bytes and no number has more
 * than 22 bytes in its textual representation (20 for digits, one for
 * sign, one for the terminating 0).
 */
template <class Tgt, class Src>
typename std::enable_if<
    is_integral_v<Src> && is_signed_v<Src> && IsSomeString<Tgt>::value &&
    sizeof(Src) >= 4>::type
toAppend(Src value, Tgt* result) {
  char buffer[to_ascii_size_max_decimal<uint64_t>];
  auto uvalue = value < 0 ? ~static_cast<uint64_t>(value) + 1
                          : static_cast<uint64_t>(value);
  if (value < 0) {
    result->push_back('-');
  }
  result->append(buffer, to_ascii_decimal(buffer, uvalue));
}

template <class Src>
typename std::enable_if<
    is_integral_v<Src> && is_signed_v<Src> && sizeof(Src) >= 4 &&
        sizeof(Src) < 16,
    size_t>::type
estimateSpaceNeeded(Src value) {
  auto uvalue = value < 0 ? ~static_cast<uint64_t>(value) + 1
                          : static_cast<uint64_t>(value);
  return size_t(value < 0) + to_ascii_size_decimal(uvalue);
}

/**
 * As above, but for uint32_t and uint64_t.
 */
template <class Tgt, class Src>
typename std::enable_if<
    is_integral_v<Src> && !is_signed_v<Src> && IsSomeString<Tgt>::value &&
    sizeof(Src) >= 4>::type
toAppend(Src value, Tgt* result) {
  char buffer[to_ascii_size_max_decimal<uint64_t>];
  result->append(buffer, to_ascii_decimal(buffer, value));
}

template <class Src>
typename std::enable_if<
    is_integral_v<Src> && !is_signed_v<Src> && sizeof(Src) >= 4 &&
        sizeof(Src) < 16,
    size_t>::type
estimateSpaceNeeded(Src value) {
  return to_ascii_size_decimal(value);
}

/**
 * All small signed and unsigned integers to string go through 32-bit
 * types int32_t and uint32_t, respectively.
 */
template <class Tgt, class Src>
typename std::enable_if<
    is_integral_v<Src> && IsSomeString<Tgt>::value && sizeof(Src) < 4>::type
toAppend(Src value, Tgt* result) {
  typedef typename std::conditional<is_signed_v<Src>, int64_t, uint64_t>::type
      Intermediate;
  toAppend<Tgt>(static_cast<Intermediate>(value), result);
}

template <class Src>
typename std::enable_if<
    is_integral_v<Src> && sizeof(Src) < 4 && !std::is_same<Src, char>::value,
    size_t>::type
estimateSpaceNeeded(Src value) {
  typedef typename std::conditional<is_signed_v<Src>, int64_t, uint64_t>::type
      Intermediate;
  return estimateSpaceNeeded(static_cast<Intermediate>(value));
}

/**
 * Enumerated values get appended as integers.
 */
template <class Tgt, class Src>
typename std::enable_if<
    std::is_enum<Src>::value && IsSomeString<Tgt>::value>::type
toAppend(Src value, Tgt* result) {
  toAppend(to_underlying(value), result);
}

template <class Src>
typename std::enable_if<std::is_enum<Src>::value, size_t>::type
estimateSpaceNeeded(Src value) {
  return estimateSpaceNeeded(to_underlying(value));
}

/*******************************************************************************
 * Conversions from floating-point types to string types.
 ******************************************************************************/

namespace detail {
constexpr int kConvMaxDecimalInShortestLow = -6;
constexpr int kConvMaxDecimalInShortestHigh = 21;
} // namespace detail

/** Wrapper around DoubleToStringConverter **/
template <class Tgt, class Src>
typename std::enable_if<
    std::is_floating_point<Src>::value && IsSomeString<Tgt>::value>::type
toAppend(
    Src value,
    Tgt* result,
    double_conversion::DoubleToStringConverter::DtoaMode mode,
    unsigned int numDigits) {
  using namespace double_conversion;
  DoubleToStringConverter conv(
      DoubleToStringConverter::NO_FLAGS,
      "Infinity",
      "NaN",
      'E',
      detail::kConvMaxDecimalInShortestLow,
      detail::kConvMaxDecimalInShortestHigh,
      6, // max leading padding zeros
      1); // max trailing padding zeros
  char buffer[256];
  StringBuilder builder(buffer, sizeof(buffer));
  switch (mode) {
    case DoubleToStringConverter::SHORTEST:
      conv.ToShortest(value, &builder);
      break;
    case DoubleToStringConverter::SHORTEST_SINGLE:
      conv.ToShortestSingle(static_cast<float>(value), &builder);
      break;
    case DoubleToStringConverter::FIXED:
      conv.ToFixed(value, int(numDigits), &builder);
      break;
    case DoubleToStringConverter::PRECISION:
    default:
      assert(mode == DoubleToStringConverter::PRECISION);
      conv.ToPrecision(value, int(numDigits), &builder);
      break;
  }
  const size_t length = size_t(builder.position());
  builder.Finalize();
  result->append(buffer, length);
}

/**
 * As above, but for floating point
 */
template <class Tgt, class Src>
typename std::enable_if<
    std::is_floating_point<Src>::value && IsSomeString<Tgt>::value>::type
toAppend(Src value, Tgt* result) {
  toAppend(
      value, result, double_conversion::DoubleToStringConverter::SHORTEST, 0);
}

/**
 * Upper bound of the length of the output from
 * DoubleToStringConverter::ToShortest(double, StringBuilder*),
 * as used in toAppend(double, string*).
 */
template <class Src>
typename std::enable_if<std::is_floating_point<Src>::value, size_t>::type
estimateSpaceNeeded(Src value) {
  // kBase10MaximalLength is 17. We add 1 for decimal point,
  // e.g. 10.0/9 is 17 digits and 18 characters, including the decimal point.
  constexpr int kMaxMantissaSpace =
      double_conversion::DoubleToStringConverter::kBase10MaximalLength + 1;
  // strlen("E-") + digits10(numeric_limits<double>::max_exponent10)
  constexpr int kMaxExponentSpace = 2 + 3;
  static const int kMaxPositiveSpace = std::max({
      // E.g. 1.1111111111111111E-100.
      kMaxMantissaSpace + kMaxExponentSpace,
      // E.g. 0.000001.1111111111111111, if kConvMaxDecimalInShortestLow is -6.
      kMaxMantissaSpace - detail::kConvMaxDecimalInShortestLow,
      // If kConvMaxDecimalInShortestHigh is 21, then 1e21 is the smallest
      // number > 1 which ToShortest outputs in exponential notation,
      // so 21 is the longest non-exponential number > 1.
      detail::kConvMaxDecimalInShortestHigh,
  });
  return size_t(
      kMaxPositiveSpace +
      (value < 0 ? 1 : 0)); // +1 for minus sign, if negative
}

/**
 * This can be specialized, together with adding specialization
 * for estimateSpaceNeed for your type, so that we allocate
 * as much as you need instead of the default
 */
template <class Src>
struct HasLengthEstimator : std::false_type {};

template <class Src>
constexpr typename std::enable_if<
    !std::is_fundamental<Src>::value &&
#if FOLLY_HAVE_INT128_T
        // On OSX 10.10, is_fundamental<__int128> is false :-O
        !std::is_same<__int128, Src>::value &&
        !std::is_same<unsigned __int128, Src>::value &&
#endif
        !IsSomeString<Src>::value &&
        !std::is_convertible<Src, const char*>::value &&
        !std::is_convertible<Src, StringPiece>::value &&
        !std::is_enum<Src>::value && !HasLengthEstimator<Src>::value,
    size_t>::type
estimateSpaceNeeded(const Src&) {
  return sizeof(Src) + 1; // dumbest best effort ever?
}

namespace detail {

template <class Tgt>
typename std::enable_if<IsSomeString<Tgt>::value, size_t>::type
estimateSpaceToReserve(size_t sofar, Tgt*) {
  return sofar;
}

template <class T, class... Ts>
size_t estimateSpaceToReserve(size_t sofar, const T& v, const Ts&... vs) {
  return estimateSpaceToReserve(sofar + estimateSpaceNeeded(v), vs...);
}

template <class... Ts>
void reserveInTarget(const Ts&... vs) {
  getLastElement(vs...)->reserve(estimateSpaceToReserve(0, vs...));
}

template <class Delimiter, class... Ts>
void reserveInTargetDelim(const Delimiter& d, const Ts&... vs) {
  static_assert(sizeof...(vs) >= 2, "Needs at least 2 args");
  size_t fordelim = (sizeof...(vs) - 2) *
      estimateSpaceToReserve(0, d, static_cast<std::string*>(nullptr));
  getLastElement(vs...)->reserve(estimateSpaceToReserve(fordelim, vs...));
}

/**
 * Variadic base case: append one element
 */
template <class T, class Tgt>
typename std::enable_if<
    IsSomeString<typename std::remove_pointer<Tgt>::type>::value>::type
toAppendStrImpl(const T& v, Tgt result) {
  toAppend(v, result);
}

template <class T, class... Ts>
typename std::enable_if<
    sizeof...(Ts) >= 2 &&
    IsSomeString<typename std::remove_pointer<
        typename detail::LastElement<const Ts&...>::type>::type>::value>::type
toAppendStrImpl(const T& v, const Ts&... vs) {
  toAppend(v, getLastElement(vs...));
  toAppendStrImpl(vs...);
}

template <class Delimiter, class T, class Tgt>
typename std::enable_if<
    IsSomeString<typename std::remove_pointer<Tgt>::type>::value>::type
toAppendDelimStrImpl(const Delimiter& /* delim */, const T& v, Tgt result) {
  toAppend(v, result);
}

template <class Delimiter, class T, class... Ts>
typename std::enable_if<
    sizeof...(Ts) >= 2 &&
    IsSomeString<typename std::remove_pointer<
        typename detail::LastElement<const Ts&...>::type>::type>::value>::type
toAppendDelimStrImpl(const Delimiter& delim, const T& v, const Ts&... vs) {
  // we are really careful here, calling toAppend with just one element does
  // not try to estimate space needed (as we already did that). If we call
  // toAppend(v, delim, ....) we would do unnecesary size calculation
  toAppend(v, detail::getLastElement(vs...));
  toAppend(delim, detail::getLastElement(vs...));
  toAppendDelimStrImpl(delim, vs...);
}
} // namespace detail

/**
 * Variadic conversion to string. Appends each element in turn.
 * If we have two or more things to append, we will not reserve
 * the space for them and will depend on strings exponential growth.
 * If you just append once consider using toAppendFit which reserves
 * the space needed (but does not have exponential as a result).
 *
 * Custom implementations of toAppend() can be provided in the same namespace as
 * the type to customize printing. estimateSpaceNeed() may also be provided to
 * avoid reallocations in toAppendFit():
 *
 * namespace other_namespace {
 *
 * template <class String>
 * void toAppend(const OtherType&, String* out);
 *
 * // optional
 * size_t estimateSpaceNeeded(const OtherType&);
 *
 * }
 */
template <class... Ts>
typename std::enable_if<
    sizeof...(Ts) >= 3 &&
    IsSomeString<typename std::remove_pointer<
        typename detail::LastElement<const Ts&...>::type>::type>::value>::type
toAppend(const Ts&... vs) {
  ::folly::detail::toAppendStrImpl(vs...);
}

#ifdef _MSC_VER
// Special case pid_t on MSVC, because it's a void* rather than an
// integral type. We can't do a global special case because this is already
// dangerous enough (as most pointers will implicitly convert to a void*)
// just doing it for MSVC.
template <class Tgt>
void toAppend(const pid_t a, Tgt* res) {
  toAppend(uint64_t(a), res);
}
#endif

/**
 * Special version of the call that preallocates exaclty as much memory
 * as need for arguments to be stored in target. This means we are
 * not doing exponential growth when we append. If you are using it
 * in a loop you are aiming at your foot with a big perf-destroying
 * bazooka.
 * On the other hand if you are appending to a string once, this
 * will probably save a few calls to malloc.
 */
template <class... Ts>
typename std::enable_if<IsSomeString<typename std::remove_pointer<
    typename detail::LastElement<const Ts&...>::type>::type>::value>::type
toAppendFit(const Ts&... vs) {
  ::folly::detail::reserveInTarget(vs...);
  toAppend(vs...);
}

template <class Ts>
void toAppendFit(const Ts&) {}

/**
 * Variadic base case: do nothing.
 */
template <class Tgt>
typename std::enable_if<IsSomeString<Tgt>::value>::type toAppend(
    Tgt* /* result */) {}

/**
 * Variadic base case: do nothing.
 */
template <class Delimiter, class Tgt>
typename std::enable_if<IsSomeString<Tgt>::value>::type toAppendDelim(
    const Delimiter& /* delim */, Tgt* /* result */) {}

/**
 * 1 element: same as toAppend.
 */
template <class Delimiter, class T, class Tgt>
typename std::enable_if<IsSomeString<Tgt>::value>::type toAppendDelim(
    const Delimiter& /* delim */, const T& v, Tgt* tgt) {
  toAppend(v, tgt);
}

/**
 * Append to string with a delimiter in between elements. Check out
 * comments for toAppend for details about memory allocation.
 */
template <class Delimiter, class... Ts>
typename std::enable_if<
    sizeof...(Ts) >= 3 &&
    IsSomeString<typename std::remove_pointer<
        typename detail::LastElement<const Ts&...>::type>::type>::value>::type
toAppendDelim(const Delimiter& delim, const Ts&... vs) {
  detail::toAppendDelimStrImpl(delim, vs...);
}

/**
 * Detail in comment for toAppendFit
 */
template <class Delimiter, class... Ts>
typename std::enable_if<IsSomeString<typename std::remove_pointer<
    typename detail::LastElement<const Ts&...>::type>::type>::value>::type
toAppendDelimFit(const Delimiter& delim, const Ts&... vs) {
  detail::reserveInTargetDelim(delim, vs...);
  toAppendDelim(delim, vs...);
}

template <class De, class Ts>
void toAppendDelimFit(const De&, const Ts&) {}

/**
 * to<SomeString>(v1, v2, ...) uses toAppend() (see below) as back-end
 * for all types.
 */
template <class Tgt, class... Ts>
typename std::enable_if<
    IsSomeString<Tgt>::value &&
        (sizeof...(Ts) != 1 ||
         !std::is_same<Tgt, typename detail::LastElement<const Ts&...>::type>::
             value),
    Tgt>::type
to(const Ts&... vs) {
  Tgt result;
  toAppendFit(vs..., &result);
  return result;
}

/**
 * Special version of to<SomeString> for floating point. When calling
 * folly::to<SomeString>(double), generic implementation above will
 * firstly reserve 24 (or 25 when negative value) bytes. This will
 * introduce a malloc call for most mainstream string implementations.
 *
 * But for most cases, a floating point doesn't need 24 (or 25) bytes to
 * be converted as a string.
 *
 * This special version will not do string reserve.
 */
template <class Tgt, class Src>
typename std::enable_if<
    IsSomeString<Tgt>::value && std::is_floating_point<Src>::value,
    Tgt>::type
to(Src value) {
  Tgt result;
  toAppend(value, &result);
  return result;
}

/**
 * toDelim<SomeString>(SomeString str) returns itself.
 */
template <class Tgt, class Delim, class Src>
typename std::enable_if<
    IsSomeString<Tgt>::value &&
        std::is_same<Tgt, typename std::decay<Src>::type>::value,
    Tgt>::type
toDelim(const Delim& /* delim */, Src&& value) {
  return std::forward<Src>(value);
}

/**
 * toDelim<SomeString>(delim, v1, v2, ...) uses toAppendDelim() as
 * back-end for all types.
 */
template <class Tgt, class Delim, class... Ts>
typename std::enable_if<
    IsSomeString<Tgt>::value &&
        (sizeof...(Ts) != 1 ||
         !std::is_same<Tgt, typename detail::LastElement<const Ts&...>::type>::
             value),
    Tgt>::type
toDelim(const Delim& delim, const Ts&... vs) {
  Tgt result;
  toAppendDelimFit(delim, vs..., &result);
  return result;
}

/*******************************************************************************
 * Conversions from string types to integral types.
 ******************************************************************************/

namespace detail {

Expected<bool, ConversionCode> str_to_bool(StringPiece* src) noexcept;

template <typename T>
Expected<T, ConversionCode> str_to_floating(StringPiece* src) noexcept;

extern template Expected<float, ConversionCode> str_to_floating<float>(
    StringPiece* src) noexcept;
extern template Expected<double, ConversionCode> str_to_floating<double>(
    StringPiece* src) noexcept;

template <class Tgt>
Expected<Tgt, ConversionCode> digits_to(const char* b, const char* e) noexcept;

extern template Expected<char, ConversionCode> digits_to<char>(
    const char*, const char*) noexcept;
extern template Expected<signed char, ConversionCode> digits_to<signed char>(
    const char*, const char*) noexcept;
extern template Expected<unsigned char, ConversionCode>
digits_to<unsigned char>(const char*, const char*) noexcept;

extern template Expected<short, ConversionCode> digits_to<short>(
    const char*, const char*) noexcept;
extern template Expected<unsigned short, ConversionCode>
digits_to<unsigned short>(const char*, const char*) noexcept;

extern template Expected<int, ConversionCode> digits_to<int>(
    const char*, const char*) noexcept;
extern template Expected<unsigned int, ConversionCode> digits_to<unsigned int>(
    const char*, const char*) noexcept;

extern template Expected<long, ConversionCode> digits_to<long>(
    const char*, const char*) noexcept;
extern template Expected<unsigned long, ConversionCode>
digits_to<unsigned long>(const char*, const char*) noexcept;

extern template Expected<long long, ConversionCode> digits_to<long long>(
    const char*, const char*) noexcept;
extern template Expected<unsigned long long, ConversionCode>
digits_to<unsigned long long>(const char*, const char*) noexcept;

#if FOLLY_HAVE_INT128_T
extern template Expected<__int128, ConversionCode> digits_to<__int128>(
    const char*, const char*) noexcept;
extern template Expected<unsigned __int128, ConversionCode>
digits_to<unsigned __int128>(const char*, const char*) noexcept;
#endif

template <class T>
Expected<T, ConversionCode> str_to_integral(StringPiece* src) noexcept;

extern template Expected<char, ConversionCode> str_to_integral<char>(
    StringPiece* src) noexcept;
extern template Expected<signed char, ConversionCode>
str_to_integral<signed char>(StringPiece* src) noexcept;
extern template Expected<unsigned char, ConversionCode>
str_to_integral<unsigned char>(StringPiece* src) noexcept;

extern template Expected<short, ConversionCode> str_to_integral<short>(
    StringPiece* src) noexcept;
extern template Expected<unsigned short, ConversionCode>
str_to_integral<unsigned short>(StringPiece* src) noexcept;

extern template Expected<int, ConversionCode> str_to_integral<int>(
    StringPiece* src) noexcept;
extern template Expected<unsigned int, ConversionCode>
str_to_integral<unsigned int>(StringPiece* src) noexcept;

extern template Expected<long, ConversionCode> str_to_integral<long>(
    StringPiece* src) noexcept;
extern template Expected<unsigned long, ConversionCode>
str_to_integral<unsigned long>(StringPiece* src) noexcept;

extern template Expected<long long, ConversionCode> str_to_integral<long long>(
    StringPiece* src) noexcept;
extern template Expected<unsigned long long, ConversionCode>
str_to_integral<unsigned long long>(StringPiece* src) noexcept;

#if FOLLY_HAVE_INT128_T
extern template Expected<__int128, ConversionCode> str_to_integral<__int128>(
    StringPiece* src) noexcept;
extern template Expected<unsigned __int128, ConversionCode>
str_to_integral<unsigned __int128>(StringPiece* src) noexcept;
#endif

template <typename T>
typename std::
    enable_if<std::is_same<T, bool>::value, Expected<T, ConversionCode>>::type
    convertTo(StringPiece* src) noexcept {
  return str_to_bool(src);
}

template <typename T>
typename std::enable_if<
    std::is_floating_point<T>::value,
    Expected<T, ConversionCode>>::type
convertTo(StringPiece* src) noexcept {
  return str_to_floating<T>(src);
}

template <typename T>
typename std::enable_if<
    is_integral_v<T> && !std::is_same<T, bool>::value,
    Expected<T, ConversionCode>>::type
convertTo(StringPiece* src) noexcept {
  return str_to_integral<T>(src);
}

} // namespace detail

/**
 * String represented as a pair of pointers to char to unsigned
 * integrals. Assumes NO whitespace before or after.
 */
template <typename Tgt>
typename std::enable_if<
    is_integral_v<Tgt> && !std::is_same<Tgt, bool>::value,
    Expected<Tgt, ConversionCode>>::type
tryTo(const char* b, const char* e) {
  return detail::digits_to<Tgt>(b, e);
}

template <typename Tgt>
typename std::enable_if< //
    is_integral_v<Tgt> && !std::is_same<Tgt, bool>::value,
    Tgt>::type
to(const char* b, const char* e) {
  return tryTo<Tgt>(b, e).thenOrThrow(
      [](Tgt res) { return res; },
      [=](ConversionCode code) {
        return makeConversionError(code, StringPiece(b, e));
      });
}

/*******************************************************************************
 * Conversions from string types to arithmetic types.
 ******************************************************************************/

/**
 * Parsing strings to numeric types.
 */
template <typename Tgt>
FOLLY_NODISCARD inline typename std::enable_if< //
    is_arithmetic_v<Tgt>,
    Expected<StringPiece, ConversionCode>>::type
parseTo(StringPiece src, Tgt& out) {
  return detail::convertTo<Tgt>(&src).then(
      [&](Tgt res) { return void(out = res), src; });
}

/*******************************************************************************
 * Integral / Floating Point to integral / Floating Point
 ******************************************************************************/

namespace detail {

/**
 * Bool to integral/float doesn't need any special checks, and this
 * overload means we aren't trying to see if a bool is less than
 * an integer.
 */
template <class Tgt>
typename std::enable_if<
    !std::is_same<Tgt, bool>::value &&
        (is_integral_v<Tgt> || std::is_floating_point<Tgt>::value),
    Expected<Tgt, ConversionCode>>::type
convertTo(const bool& value) noexcept {
  return static_cast<Tgt>(value ? 1 : 0);
}

/**
 * Checked conversion from integral to integral. The checks are only
 * performed when meaningful, e.g. conversion from int to long goes
 * unchecked.
 */
template <class Tgt, class Src>
typename std::enable_if<
    is_integral_v<Src> && !std::is_same<Tgt, Src>::value &&
        !std::is_same<Tgt, bool>::value && is_integral_v<Tgt>,
    Expected<Tgt, ConversionCode>>::type
convertTo(const Src& value) noexcept {
  if /* constexpr */ (
      make_unsigned_t<Tgt>(std::numeric_limits<Tgt>::max()) <
      make_unsigned_t<Src>(std::numeric_limits<Src>::max())) {
    if (greater_than<Tgt, std::numeric_limits<Tgt>::max()>(value)) {
      return makeUnexpected(ConversionCode::ARITH_POSITIVE_OVERFLOW);
    }
  }
  if /* constexpr */ (
      is_signed_v<Src> && (!is_signed_v<Tgt> || sizeof(Src) > sizeof(Tgt))) {
    if (less_than<Tgt, std::numeric_limits<Tgt>::min()>(value)) {
      return makeUnexpected(ConversionCode::ARITH_NEGATIVE_OVERFLOW);
    }
  }
  return static_cast<Tgt>(value);
}

/**
 * Checked conversion from floating to floating. The checks are only
 * performed when meaningful, e.g. conversion from float to double goes
 * unchecked.
 */
template <class Tgt, class Src>
typename std::enable_if<
    std::is_floating_point<Tgt>::value && std::is_floating_point<Src>::value &&
        !std::is_same<Tgt, Src>::value,
    Expected<Tgt, ConversionCode>>::type
convertTo(const Src& value) noexcept {
  if /* constexpr */ (
      std::numeric_limits<Tgt>::max() < std::numeric_limits<Src>::max()) {
    if (value > std::numeric_limits<Tgt>::max()) {
      return makeUnexpected(ConversionCode::ARITH_POSITIVE_OVERFLOW);
    }
    if (value < std::numeric_limits<Tgt>::lowest()) {
      return makeUnexpected(ConversionCode::ARITH_NEGATIVE_OVERFLOW);
    }
  }
  return static_cast<Tgt>(value);
}

/**
 * Check if a floating point value can safely be converted to an
 * integer value without triggering undefined behaviour.
 */
template <typename Tgt, typename Src>
inline typename std::enable_if<
    std::is_floating_point<Src>::value && is_integral_v<Tgt> &&
        !std::is_same<Tgt, bool>::value,
    bool>::type
checkConversion(const Src& value) {
  constexpr Src tgtMaxAsSrc = static_cast<Src>(std::numeric_limits<Tgt>::max());
  constexpr Src tgtMinAsSrc = static_cast<Src>(std::numeric_limits<Tgt>::min());
  if (value >= tgtMaxAsSrc) {
    if (value > tgtMaxAsSrc) {
      return false;
    }
    const Src mmax = folly::nextafter(tgtMaxAsSrc, Src());
    if (static_cast<Tgt>(value - mmax) >
        std::numeric_limits<Tgt>::max() - static_cast<Tgt>(mmax)) {
      return false;
    }
  } else if (is_signed_v<Tgt> && value <= tgtMinAsSrc) {
    if (value < tgtMinAsSrc) {
      return false;
    }
    const Src mmin = folly::nextafter(tgtMinAsSrc, Src());
    if (static_cast<Tgt>(value - mmin) <
        std::numeric_limits<Tgt>::min() - static_cast<Tgt>(mmin)) {
      return false;
    }
  }
  return true;
}

// Integers can always safely be converted to floating point values
template <typename Tgt, typename Src>
constexpr typename std::enable_if<
    is_integral_v<Src> && std::is_floating_point<Tgt>::value,
    bool>::type
checkConversion(const Src&) {
  return true;
}

// Also, floating point values can always be safely converted to bool
// Per the standard, any floating point value that is not zero will yield true
template <typename Tgt, typename Src>
constexpr typename std::enable_if<
    std::is_floating_point<Src>::value && std::is_same<Tgt, bool>::value,
    bool>::type
checkConversion(const Src&) {
  return true;
}

/**
 * Checked conversion from integral to floating point and back. The
 * result must be convertible back to the source type without loss of
 * precision. This seems Draconian but sometimes is what's needed, and
 * complements existing routines nicely. For various rounding
 * routines, see <math>.
 */
template <typename Tgt, typename Src>
typename std::enable_if<
    (is_integral_v<Src> && std::is_floating_point<Tgt>::value) ||
        (std::is_floating_point<Src>::value && is_integral_v<Tgt>),
    Expected<Tgt, ConversionCode>>::type
convertTo(const Src& value) noexcept {
  if (LIKELY(checkConversion<Tgt>(value))) {
    Tgt result = static_cast<Tgt>(value);
    if (LIKELY(checkConversion<Src>(result))) {
      Src witness = static_cast<Src>(result);
      if (LIKELY(value == witness)) {
        return result;
      }
    }
  }
  return makeUnexpected(ConversionCode::ARITH_LOSS_OF_PRECISION);
}

template <typename Tgt, typename Src>
inline std::string errorValue(const Src& value) {
  return to<std::string>("(", pretty_name<Tgt>(), ") ", value);
}

template <typename Tgt, typename Src>
using IsArithToArith = bool_constant<
    !std::is_same<Tgt, Src>::value && !std::is_same<Tgt, bool>::value &&
    is_arithmetic_v<Src> && is_arithmetic_v<Tgt>>;

} // namespace detail

template <typename Tgt, typename Src>
typename std::enable_if<
    detail::IsArithToArith<Tgt, Src>::value,
    Expected<Tgt, ConversionCode>>::type
tryTo(const Src& value) noexcept {
  return detail::convertTo<Tgt>(value);
}

template <typename Tgt, typename Src>
typename std::enable_if<detail::IsArithToArith<Tgt, Src>::value, Tgt>::type to(
    const Src& value) {
  return tryTo<Tgt>(value).thenOrThrow(
      [](Tgt res) { return res; },
      [&](ConversionCode e) {
        return makeConversionError(e, detail::errorValue<Tgt>(value));
      });
}

/*******************************************************************************
 * Custom Conversions
 *
 * Any type can be used with folly::to by implementing parseTo. The
 * implementation should be provided in the namespace of the type to facilitate
 * argument-dependent lookup:
 *
 * namespace other_namespace {
 * ::folly::Expected<::folly::StringPiece, SomeErrorCode>
 *   parseTo(::folly::StringPiece, OtherType&) noexcept;
 * }
 ******************************************************************************/
template <class T>
FOLLY_NODISCARD typename std::enable_if<
    std::is_enum<T>::value,
    Expected<StringPiece, ConversionCode>>::type
parseTo(StringPiece in, T& out) noexcept {
  typename std::underlying_type<T>::type tmp{};
  auto restOrError = parseTo(in, tmp);
  out = static_cast<T>(tmp); // Harmless if parseTo fails
  return restOrError;
}

FOLLY_NODISCARD
inline Expected<StringPiece, ConversionCode> parseTo(
    StringPiece in, StringPiece& out) noexcept {
  out = in;
  return StringPiece{in.end(), in.end()};
}

namespace detail {

template <class Str>
FOLLY_ERASE Expected<StringPiece, ConversionCode> parseToStr(
    StringPiece in, Str& out) {
  out.clear();
  out.append(in.data(), in.size()); // TODO try/catch?
  return StringPiece{in.end(), in.end()};
}

} // namespace detail

FOLLY_NODISCARD
inline Expected<StringPiece, ConversionCode> parseTo(
    StringPiece in, std::string& out) {
  return detail::parseToStr(in, out);
}

#if FOLLY_HAS_STRING_VIEW
FOLLY_NODISCARD
inline Expected<StringPiece, ConversionCode> parseTo(
    StringPiece in, std::string_view& out) {
  out = std::string_view(in.data(), in.size());
  return StringPiece{in.end(), in.end()};
}
#endif

FOLLY_NODISCARD
inline Expected<StringPiece, ConversionCode> parseTo(
    StringPiece in, fbstring& out) {
  return detail::parseToStr(in, out);
}

template <class Str>
FOLLY_NODISCARD inline typename std::enable_if<
    IsSomeString<Str>::value,
    Expected<StringPiece, ConversionCode>>::type
parseTo(StringPiece in, Str& out) {
  return detail::parseToStr(in, out);
}

namespace detail {
template <typename Tgt>
using ParseToResult = decltype(parseTo(StringPiece{}, std::declval<Tgt&>()));

struct CheckTrailingSpace {
  Expected<Unit, ConversionCode> operator()(StringPiece sp) const {
    auto e = enforceWhitespaceErr(sp);
    if (UNLIKELY(e != ConversionCode::SUCCESS)) {
      return makeUnexpected(e);
    }
    return unit;
  }
};

template <class Error>
struct ReturnUnit {
  template <class T>
  constexpr Expected<Unit, Error> operator()(T&&) const {
    return unit;
  }
};

// Older versions of the parseTo customization point threw on error and
// returned void. Handle that.
template <class Tgt>
inline typename std::enable_if<
    std::is_void<ParseToResult<Tgt>>::value,
    Expected<StringPiece, ConversionCode>>::type
parseToWrap(StringPiece sp, Tgt& out) {
  parseTo(sp, out);
  return StringPiece(sp.end(), sp.end());
}

template <class Tgt>
inline typename std::enable_if<
    !std::is_void<ParseToResult<Tgt>>::value,
    ParseToResult<Tgt>>::type
parseToWrap(StringPiece sp, Tgt& out) {
  return parseTo(sp, out);
}

template <typename Tgt>
using ParseToError = ExpectedErrorType<decltype(detail::parseToWrap(
    StringPiece{}, std::declval<Tgt&>()))>;

} // namespace detail

/**
 * String or StringPiece to target conversion. Accepts leading and trailing
 * whitespace, but no non-space trailing characters.
 */

template <class Tgt>
inline typename std::enable_if<
    !std::is_same<StringPiece, Tgt>::value,
    Expected<Tgt, detail::ParseToError<Tgt>>>::type
tryTo(StringPiece src) {
  Tgt result{};
  using Error = detail::ParseToError<Tgt>;
  using Check = typename std::conditional<
      is_arithmetic_v<Tgt>,
      detail::CheckTrailingSpace,
      detail::ReturnUnit<Error>>::type;
  return parseTo(src, result).then(Check(), [&](Unit) {
    return std::move(result);
  });
}

template <class Tgt, class Src>
inline typename std::enable_if<
    IsSomeString<Src>::value && !std::is_same<StringPiece, Tgt>::value,
    Tgt>::type
to(Src const& src) {
  return to<Tgt>(StringPiece(src.data(), src.size()));
}

template <class Tgt>
inline
    typename std::enable_if<!std::is_same<StringPiece, Tgt>::value, Tgt>::type
    to(StringPiece src) {
  Tgt result{};
  using Error = detail::ParseToError<Tgt>;
  using Check = typename std::conditional<
      is_arithmetic_v<Tgt>,
      detail::CheckTrailingSpace,
      detail::ReturnUnit<Error>>::type;
  auto tmp = detail::parseToWrap(src, result);
  return tmp
      .thenOrThrow(
          Check(),
          [&](Error e) { throw_exception(makeConversionError(e, src)); })
      .thenOrThrow(
          [&](Unit) { return std::move(result); },
          [&](Error e) {
            throw_exception(makeConversionError(e, tmp.value()));
          });
}

/**
 * tryTo/to that take the strings by pointer so the caller gets information
 * about how much of the string was consumed by the conversion. These do not
 * check for trailing whitepsace.
 */
template <class Tgt>
Expected<Tgt, detail::ParseToError<Tgt>> tryTo(StringPiece* src) {
  Tgt result;
  return parseTo(*src, result).then([&, src](StringPiece sp) -> Tgt {
    *src = sp;
    return std::move(result);
  });
}

template <class Tgt>
Tgt to(StringPiece* src) {
  Tgt result{};
  using Error = detail::ParseToError<Tgt>;
  return parseTo(*src, result)
      .thenOrThrow(
          [&, src](StringPiece sp) -> Tgt {
            *src = sp;
            return std::move(result);
          },
          [=](Error e) { return makeConversionError(e, *src); });
}

/*******************************************************************************
 * Enum to anything and back
 ******************************************************************************/

template <class Tgt, class Src>
typename std::enable_if<
    std::is_enum<Src>::value && !std::is_same<Src, Tgt>::value &&
        !std::is_convertible<Tgt, StringPiece>::value,
    Expected<Tgt, ConversionCode>>::type
tryTo(const Src& value) {
  return tryTo<Tgt>(to_underlying(value));
}

template <class Tgt, class Src>
typename std::enable_if<
    !std::is_convertible<Src, StringPiece>::value && std::is_enum<Tgt>::value &&
        !std::is_same<Src, Tgt>::value,
    Expected<Tgt, ConversionCode>>::type
tryTo(const Src& value) {
  using I = typename std::underlying_type<Tgt>::type;
  return tryTo<I>(value).then([](I i) { return static_cast<Tgt>(i); });
}

template <class Tgt, class Src>
typename std::enable_if<
    std::is_enum<Src>::value && !std::is_same<Src, Tgt>::value &&
        !std::is_convertible<Tgt, StringPiece>::value,
    Tgt>::type
to(const Src& value) {
  return to<Tgt>(to_underlying(value));
}

template <class Tgt, class Src>
typename std::enable_if<
    !std::is_convertible<Src, StringPiece>::value && std::is_enum<Tgt>::value &&
        !std::is_same<Src, Tgt>::value,
    Tgt>::type
to(const Src& value) {
  return static_cast<Tgt>(to<typename std::underlying_type<Tgt>::type>(value));
}

} // namespace folly
