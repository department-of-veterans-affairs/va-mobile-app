/*
 *          Copyright Andrey Semashev 2007 - 2015.
 * Distributed under the Boost Software License, Version 1.0.
 *    (See accompanying file LICENSE_1_0.txt or copy at
 *          http://www.boost.org/LICENSE_1_0.txt)
 */
/*!
 * \file   keywords/empty_marker.hpp
 * \author Andrey Semashev
 * \date   15.03.2014
 *
 * The header contains the \c empty_marker keyword declaration.
 */

#ifndef BOOST_LOG_KEYWORDS_EMPTY_MARKER_HPP_INCLUDED_
#define BOOST_LOG_KEYWORDS_EMPTY_MARKER_HPP_INCLUDED_

#include <boost/parameter/keyword.hpp>
#include <boost/log/detail/config.hpp>

#ifdef BOOST_HAS_PRAGMA_ONCE
#pragma once
#endif

namespace boost {

BOOST_LOG_OPEN_NAMESPACE

namespace keywords {

//! The keyword for passing the marker for the empty list of scopes to the \c named_scope formatter
BOOST_PARAMETER_KEYWORD(tag, empty_marker)

} // namespace keywords

BOOST_LOG_CLOSE_NAMESPACE // namespace log

} // namespace boost

#endif // BOOST_LOG_KEYWORDS_EMPTY_MARKER_HPP_INCLUDED_
