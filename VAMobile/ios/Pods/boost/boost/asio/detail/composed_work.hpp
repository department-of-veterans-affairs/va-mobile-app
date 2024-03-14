//
// detail/composed_work.hpp
// ~~~~~~~~~~~~~~~~~~~~~~~~
//
// Copyright (c) 2003-2023 Christopher M. Kohlhoff (chris at kohlhoff dot com)
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
//

#ifndef BOOST_ASIO_DETAIL_COMPOSED_WORK_HPP
#define BOOST_ASIO_DETAIL_COMPOSED_WORK_HPP

#if defined(_MSC_VER) && (_MSC_VER >= 1200)
# pragma once
#endif // defined(_MSC_VER) && (_MSC_VER >= 1200)

#include <boost/asio/detail/config.hpp>
#include <boost/asio/detail/type_traits.hpp>
#include <boost/asio/detail/variadic_templates.hpp>
#include <boost/asio/execution/executor.hpp>
#include <boost/asio/execution/outstanding_work.hpp>
#include <boost/asio/executor_work_guard.hpp>
#include <boost/asio/is_executor.hpp>
#include <boost/asio/system_executor.hpp>

#include <boost/asio/detail/push_options.hpp>

namespace boost {
namespace asio {
namespace detail {

template <typename Executor, typename = void>
class composed_work_guard
{
public:
  typedef typename decay<
      typename prefer_result<Executor,
        execution::outstanding_work_t::tracked_t
      >::type
    >::type executor_type;

  composed_work_guard(const Executor& ex)
    : executor_(boost::asio::prefer(ex, execution::outstanding_work.tracked))
  {
  }

  void reset()
  {
  }

  executor_type get_executor() const BOOST_ASIO_NOEXCEPT
  {
    return executor_;
  }

private:
  executor_type executor_;
};

template <>
struct composed_work_guard<system_executor>
{
public:
  typedef system_executor executor_type;

  composed_work_guard(const system_executor&)
  {
  }

  void reset()
  {
  }

  executor_type get_executor() const BOOST_ASIO_NOEXCEPT
  {
    return system_executor();
  }
};

#if !defined(BOOST_ASIO_NO_TS_EXECUTORS)

template <typename Executor>
struct composed_work_guard<Executor,
    typename enable_if<
      !execution::is_executor<Executor>::value
    >::type> : executor_work_guard<Executor>
{
  composed_work_guard(const Executor& ex)
    : executor_work_guard<Executor>(ex)
  {
  }
};

#endif // !defined(BOOST_ASIO_NO_TS_EXECUTORS)

template <typename>
struct composed_io_executors;

template <>
struct composed_io_executors<void()>
{
  composed_io_executors() BOOST_ASIO_NOEXCEPT
    : head_(system_executor())
  {
  }

  typedef system_executor head_type;
  system_executor head_;
};

inline composed_io_executors<void()> make_composed_io_executors()
{
  return composed_io_executors<void()>();
}

template <typename Head>
struct composed_io_executors<void(Head)>
{
  explicit composed_io_executors(const Head& ex) BOOST_ASIO_NOEXCEPT
    : head_(ex)
  {
  }

  typedef Head head_type;
  Head head_;
};

template <typename Head>
inline composed_io_executors<void(Head)>
make_composed_io_executors(const Head& head)
{
  return composed_io_executors<void(Head)>(head);
}

#if defined(BOOST_ASIO_HAS_VARIADIC_TEMPLATES)

template <typename Head, typename... Tail>
struct composed_io_executors<void(Head, Tail...)>
{
  explicit composed_io_executors(const Head& head,
      const Tail&... tail) BOOST_ASIO_NOEXCEPT
    : head_(head),
      tail_(tail...)
  {
  }

  void reset()
  {
    head_.reset();
    tail_.reset();
  }

  typedef Head head_type;
  Head head_;
  composed_io_executors<void(Tail...)> tail_;
};

template <typename Head, typename... Tail>
inline composed_io_executors<void(Head, Tail...)>
make_composed_io_executors(const Head& head, const Tail&... tail)
{
  return composed_io_executors<void(Head, Tail...)>(head, tail...);
}

#else // defined(BOOST_ASIO_HAS_VARIADIC_TEMPLATES)

#define BOOST_ASIO_PRIVATE_COMPOSED_IO_EXECUTORS_DEF(n) \
template <typename Head, BOOST_ASIO_VARIADIC_TPARAMS(n)> \
struct composed_io_executors<void(Head, BOOST_ASIO_VARIADIC_TARGS(n))> \
{ \
  explicit composed_io_executors(const Head& head, \
      BOOST_ASIO_VARIADIC_CONSTREF_PARAMS(n)) BOOST_ASIO_NOEXCEPT \
    : head_(head), \
      tail_(BOOST_ASIO_VARIADIC_BYVAL_ARGS(n)) \
  { \
  } \
\
  void reset() \
  { \
    head_.reset(); \
    tail_.reset(); \
  } \
\
  typedef Head head_type; \
  Head head_; \
  composed_io_executors<void(BOOST_ASIO_VARIADIC_TARGS(n))> tail_; \
}; \
\
template <typename Head, BOOST_ASIO_VARIADIC_TPARAMS(n)> \
inline composed_io_executors<void(Head, BOOST_ASIO_VARIADIC_TARGS(n))> \
make_composed_io_executors(const Head& head, \
    BOOST_ASIO_VARIADIC_CONSTREF_PARAMS(n)) \
{ \
  return composed_io_executors< \
    void(Head, BOOST_ASIO_VARIADIC_TARGS(n))>( \
      head, BOOST_ASIO_VARIADIC_BYVAL_ARGS(n)); \
} \
/**/
BOOST_ASIO_VARIADIC_GENERATE(BOOST_ASIO_PRIVATE_COMPOSED_IO_EXECUTORS_DEF)
#undef BOOST_ASIO_PRIVATE_COMPOSED_IO_EXECUTORS_DEF

#endif // defined(BOOST_ASIO_HAS_VARIADIC_TEMPLATES)

template <typename>
struct composed_work;

template <>
struct composed_work<void()>
{
  typedef composed_io_executors<void()> executors_type;

  composed_work(const executors_type&) BOOST_ASIO_NOEXCEPT
    : head_(system_executor())
  {
  }

  void reset()
  {
    head_.reset();
  }

  typedef system_executor head_type;
  composed_work_guard<system_executor> head_;
};

template <typename Head>
struct composed_work<void(Head)>
{
  typedef composed_io_executors<void(Head)> executors_type;

  explicit composed_work(const executors_type& ex) BOOST_ASIO_NOEXCEPT
    : head_(ex.head_)
  {
  }

  void reset()
  {
    head_.reset();
  }

  typedef Head head_type;
  composed_work_guard<Head> head_;
};

#if defined(BOOST_ASIO_HAS_VARIADIC_TEMPLATES)

template <typename Head, typename... Tail>
struct composed_work<void(Head, Tail...)>
{
  typedef composed_io_executors<void(Head, Tail...)> executors_type;

  explicit composed_work(const executors_type& ex) BOOST_ASIO_NOEXCEPT
    : head_(ex.head_),
      tail_(ex.tail_)
  {
  }

  void reset()
  {
    head_.reset();
    tail_.reset();
  }

  typedef Head head_type;
  composed_work_guard<Head> head_;
  composed_work<void(Tail...)> tail_;
};

#else // defined(BOOST_ASIO_HAS_VARIADIC_TEMPLATES)

#define BOOST_ASIO_PRIVATE_COMPOSED_WORK_DEF(n) \
template <typename Head, BOOST_ASIO_VARIADIC_TPARAMS(n)> \
struct composed_work<void(Head, BOOST_ASIO_VARIADIC_TARGS(n))> \
{ \
  typedef composed_io_executors<void(Head, \
    BOOST_ASIO_VARIADIC_TARGS(n))> executors_type; \
\
  explicit composed_work(const executors_type& ex) BOOST_ASIO_NOEXCEPT \
    : head_(ex.head_), \
      tail_(ex.tail_) \
  { \
  } \
\
  void reset() \
  { \
    head_.reset(); \
    tail_.reset(); \
  } \
\
  typedef Head head_type; \
  composed_work_guard<Head> head_; \
  composed_work<void(BOOST_ASIO_VARIADIC_TARGS(n))> tail_; \
}; \
/**/
BOOST_ASIO_VARIADIC_GENERATE(BOOST_ASIO_PRIVATE_COMPOSED_WORK_DEF)
#undef BOOST_ASIO_PRIVATE_COMPOSED_WORK_DEF

#endif // defined(BOOST_ASIO_HAS_VARIADIC_TEMPLATES)

template <typename IoObject>
inline typename IoObject::executor_type
get_composed_io_executor(IoObject& io_object,
    typename enable_if<
      !is_executor<IoObject>::value
    >::type* = 0,
    typename enable_if<
      !execution::is_executor<IoObject>::value
    >::type* = 0)
{
  return io_object.get_executor();
}

template <typename Executor>
inline const Executor& get_composed_io_executor(const Executor& ex,
    typename enable_if<
      is_executor<Executor>::value
        || execution::is_executor<Executor>::value
    >::type* = 0)
{
  return ex;
}

} // namespace detail
} // namespace asio
} // namespace boost

#include <boost/asio/detail/pop_options.hpp>

#endif // BOOST_ASIO_DETAIL_COMPOSED_WORK_HPP
