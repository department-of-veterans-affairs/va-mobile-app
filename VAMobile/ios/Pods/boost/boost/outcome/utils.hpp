/* Tries to convert an exception ptr into its equivalent error code
(C) 2017-2023 Niall Douglas <http://www.nedproductions.biz/> (11 commits)
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

#ifndef BOOST_OUTCOME_UTILS_HPP
#define BOOST_OUTCOME_UTILS_HPP

#include "config.hpp"

#include <exception>
#include <string>
#include <system_error>

BOOST_OUTCOME_V2_NAMESPACE_BEGIN

#ifndef BOOST_NO_EXCEPTIONS
/*! AWAITING HUGO JSON CONVERSION TOOL 
SIGNATURE NOT RECOGNISED
*/
inline std::error_code error_from_exception(std::exception_ptr &&ep = std::current_exception(), std::error_code not_matched = std::make_error_code(std::errc::resource_unavailable_try_again)) noexcept
{
  if(!ep)
  {
    return {};
  }
  try
  {
    std::rethrow_exception(ep);
  }
  catch(const std::invalid_argument & /*unused*/)
  {
    ep = std::exception_ptr();
    return std::make_error_code(std::errc::invalid_argument);
  }
  catch(const std::domain_error & /*unused*/)
  {
    ep = std::exception_ptr();
    return std::make_error_code(std::errc::argument_out_of_domain);
  }
  catch(const std::length_error & /*unused*/)
  {
    ep = std::exception_ptr();
    return std::make_error_code(std::errc::argument_list_too_long);
  }
  catch(const std::out_of_range & /*unused*/)
  {
    ep = std::exception_ptr();
    return std::make_error_code(std::errc::result_out_of_range);
  }
  catch(const std::logic_error & /*unused*/) /* base class for this group */
  {
    ep = std::exception_ptr();
    return std::make_error_code(std::errc::invalid_argument);
  }
  catch(const std::system_error &e) /* also catches ios::failure */
  {
    ep = std::exception_ptr();
    return e.code();
  }
  catch(const std::overflow_error & /*unused*/)
  {
    ep = std::exception_ptr();
    return std::make_error_code(std::errc::value_too_large);
  }
  catch(const std::range_error & /*unused*/)
  {
    ep = std::exception_ptr();
    return std::make_error_code(std::errc::result_out_of_range);
  }
  catch(const std::runtime_error & /*unused*/) /* base class for this group */
  {
    ep = std::exception_ptr();
    return std::make_error_code(std::errc::resource_unavailable_try_again);
  }
  catch(const std::bad_alloc & /*unused*/)
  {
    ep = std::exception_ptr();
    return std::make_error_code(std::errc::not_enough_memory);
  }
  catch(...)
  {
  }
  return not_matched;
}

/*! AWAITING HUGO JSON CONVERSION TOOL 
SIGNATURE NOT RECOGNISED
*/
inline void try_throw_std_exception_from_error(std::error_code ec, const std::string &msg = std::string{})
{
  if(!ec || (ec.category() != std::generic_category()
#ifndef _WIN32
             && ec.category() != std::system_category()
#endif
             ))
  {
    return;
  }
  switch(ec.value())
  {
  case EINVAL:
    throw msg.empty() ? std::invalid_argument("invalid argument") : std::invalid_argument(msg);
  case EDOM:
    throw msg.empty() ? std::domain_error("domain error") : std::domain_error(msg);
  case E2BIG:
    throw msg.empty() ? std::length_error("length error") : std::length_error(msg);
  case ERANGE:
    throw msg.empty() ? std::out_of_range("out of range") : std::out_of_range(msg);
  case EOVERFLOW:
    throw msg.empty() ? std::overflow_error("overflow error") : std::overflow_error(msg);
  case ENOMEM:
    throw std::bad_alloc();
  }
}
#endif

BOOST_OUTCOME_V2_NAMESPACE_END

#endif
