/* Copyright 2022 Joaquin M Lopez Munoz.
 * Distributed under the Boost Software License, Version 1.0.
 * (See accompanying file LICENSE_1_0.txt or copy at
 * http://www.boost.org/LICENSE_1_0.txt)
 *
 * See https://www.boost.org/libs/unordered for library home page.
 */

#ifndef BOOST_UNORDERED_DETAIL_NARROW_CAST_HPP
#define BOOST_UNORDERED_DETAIL_NARROW_CAST_HPP

#include <boost/config.hpp>
#include <boost/static_assert.hpp>
#include <boost/type_traits/is_integral.hpp>
#include <boost/type_traits/make_unsigned.hpp>

namespace boost{
namespace unordered{
namespace detail{

template<typename To,typename From>
BOOST_CONSTEXPR To narrow_cast(From x) BOOST_NOEXCEPT
{
  BOOST_STATIC_ASSERT(boost::is_integral<From>::value);
  BOOST_STATIC_ASSERT(boost::is_integral<To>::value);
  BOOST_STATIC_ASSERT(sizeof(From)>=sizeof(To));

  return static_cast<To>(
    x

#if defined(__MSVC_RUNTIME_CHECKS)
    /* Avoids VS's "Run-Time Check Failure #1 - A cast to a smaller data type
     * has caused a loss of data."
     */
    &static_cast<typename boost::make_unsigned<To>::type>(~static_cast<To>(0))
#endif
  );
}

} /* namespace detail */
} /* namespace unordered */
} /* namespace boost */

#endif
