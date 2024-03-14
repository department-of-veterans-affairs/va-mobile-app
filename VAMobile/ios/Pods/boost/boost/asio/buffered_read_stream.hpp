//
// buffered_read_stream.hpp
// ~~~~~~~~~~~~~~~~~~~~~~~~
//
// Copyright (c) 2003-2023 Christopher M. Kohlhoff (chris at kohlhoff dot com)
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
//

#ifndef BOOST_ASIO_BUFFERED_READ_STREAM_HPP
#define BOOST_ASIO_BUFFERED_READ_STREAM_HPP

#if defined(_MSC_VER) && (_MSC_VER >= 1200)
# pragma once
#endif // defined(_MSC_VER) && (_MSC_VER >= 1200)

#include <boost/asio/detail/config.hpp>
#include <cstddef>
#include <boost/asio/async_result.hpp>
#include <boost/asio/buffered_read_stream_fwd.hpp>
#include <boost/asio/buffer.hpp>
#include <boost/asio/detail/bind_handler.hpp>
#include <boost/asio/detail/buffer_resize_guard.hpp>
#include <boost/asio/detail/buffered_stream_storage.hpp>
#include <boost/asio/detail/noncopyable.hpp>
#include <boost/asio/detail/type_traits.hpp>
#include <boost/asio/error.hpp>

#include <boost/asio/detail/push_options.hpp>

namespace boost {
namespace asio {
namespace detail {

template <typename> class initiate_async_buffered_fill;
template <typename> class initiate_async_buffered_read_some;

} // namespace detail

/// Adds buffering to the read-related operations of a stream.
/**
 * The buffered_read_stream class template can be used to add buffering to the
 * synchronous and asynchronous read operations of a stream.
 *
 * @par Thread Safety
 * @e Distinct @e objects: Safe.@n
 * @e Shared @e objects: Unsafe.
 *
 * @par Concepts:
 * AsyncReadStream, AsyncWriteStream, Stream, SyncReadStream, SyncWriteStream.
 */
template <typename Stream>
class buffered_read_stream
  : private noncopyable
{
public:
  /// The type of the next layer.
  typedef typename remove_reference<Stream>::type next_layer_type;

  /// The type of the lowest layer.
  typedef typename next_layer_type::lowest_layer_type lowest_layer_type;

  /// The type of the executor associated with the object.
  typedef typename lowest_layer_type::executor_type executor_type;

#if defined(GENERATING_DOCUMENTATION)
  /// The default buffer size.
  static const std::size_t default_buffer_size = implementation_defined;
#else
  BOOST_ASIO_STATIC_CONSTANT(std::size_t, default_buffer_size = 1024);
#endif

  /// Construct, passing the specified argument to initialise the next layer.
  template <typename Arg>
  explicit buffered_read_stream(BOOST_ASIO_MOVE_OR_LVALUE_ARG(Arg) a)
    : next_layer_(BOOST_ASIO_MOVE_OR_LVALUE(Arg)(a)),
      storage_(default_buffer_size)
  {
  }

  /// Construct, passing the specified argument to initialise the next layer.
  template <typename Arg>
  buffered_read_stream(BOOST_ASIO_MOVE_OR_LVALUE_ARG(Arg) a,
      std::size_t buffer_size)
    : next_layer_(BOOST_ASIO_MOVE_OR_LVALUE(Arg)(a)),
      storage_(buffer_size)
  {
  }

  /// Get a reference to the next layer.
  next_layer_type& next_layer()
  {
    return next_layer_;
  }

  /// Get a reference to the lowest layer.
  lowest_layer_type& lowest_layer()
  {
    return next_layer_.lowest_layer();
  }

  /// Get a const reference to the lowest layer.
  const lowest_layer_type& lowest_layer() const
  {
    return next_layer_.lowest_layer();
  }

  /// Get the executor associated with the object.
  executor_type get_executor() BOOST_ASIO_NOEXCEPT
  {
    return next_layer_.lowest_layer().get_executor();
  }

  /// Close the stream.
  void close()
  {
    next_layer_.close();
  }

  /// Close the stream.
  BOOST_ASIO_SYNC_OP_VOID close(boost::system::error_code& ec)
  {
    next_layer_.close(ec);
    BOOST_ASIO_SYNC_OP_VOID_RETURN(ec);
  }

  /// Write the given data to the stream. Returns the number of bytes written.
  /// Throws an exception on failure.
  template <typename ConstBufferSequence>
  std::size_t write_some(const ConstBufferSequence& buffers)
  {
    return next_layer_.write_some(buffers);
  }

  /// Write the given data to the stream. Returns the number of bytes written,
  /// or 0 if an error occurred.
  template <typename ConstBufferSequence>
  std::size_t write_some(const ConstBufferSequence& buffers,
      boost::system::error_code& ec)
  {
    return next_layer_.write_some(buffers, ec);
  }

  /// Start an asynchronous write. The data being written must be valid for the
  /// lifetime of the asynchronous operation.
  /**
   * @par Completion Signature
   * @code void(boost::system::error_code, std::size_t) @endcode
   */
  template <typename ConstBufferSequence,
      BOOST_ASIO_COMPLETION_TOKEN_FOR(void (boost::system::error_code,
        std::size_t)) WriteHandler
          BOOST_ASIO_DEFAULT_COMPLETION_TOKEN_TYPE(executor_type)>
  BOOST_ASIO_INITFN_AUTO_RESULT_TYPE_PREFIX(WriteHandler,
      void (boost::system::error_code, std::size_t))
  async_write_some(const ConstBufferSequence& buffers,
      BOOST_ASIO_MOVE_ARG(WriteHandler) handler
        BOOST_ASIO_DEFAULT_COMPLETION_TOKEN(executor_type))
    BOOST_ASIO_INITFN_AUTO_RESULT_TYPE_SUFFIX((
      declval<typename conditional<true, Stream&, WriteHandler>::type>()
        .async_write_some(buffers,
          BOOST_ASIO_MOVE_CAST(WriteHandler)(handler))))
  {
    return next_layer_.async_write_some(buffers,
        BOOST_ASIO_MOVE_CAST(WriteHandler)(handler));
  }

  /// Fill the buffer with some data. Returns the number of bytes placed in the
  /// buffer as a result of the operation. Throws an exception on failure.
  std::size_t fill();

  /// Fill the buffer with some data. Returns the number of bytes placed in the
  /// buffer as a result of the operation, or 0 if an error occurred.
  std::size_t fill(boost::system::error_code& ec);

  /// Start an asynchronous fill.
  /**
   * @par Completion Signature
   * @code void(boost::system::error_code, std::size_t) @endcode
   */
  template <
      BOOST_ASIO_COMPLETION_TOKEN_FOR(void (boost::system::error_code,
        std::size_t)) ReadHandler
          BOOST_ASIO_DEFAULT_COMPLETION_TOKEN_TYPE(executor_type)>
  BOOST_ASIO_INITFN_AUTO_RESULT_TYPE_PREFIX(ReadHandler,
      void (boost::system::error_code, std::size_t))
  async_fill(
      BOOST_ASIO_MOVE_ARG(ReadHandler) handler
        BOOST_ASIO_DEFAULT_COMPLETION_TOKEN(executor_type))
    BOOST_ASIO_INITFN_AUTO_RESULT_TYPE_SUFFIX((
      async_initiate<ReadHandler,
        void (boost::system::error_code, std::size_t)>(
          declval<detail::initiate_async_buffered_fill<Stream> >(),
          handler, declval<detail::buffered_stream_storage*>())));

  /// Read some data from the stream. Returns the number of bytes read. Throws
  /// an exception on failure.
  template <typename MutableBufferSequence>
  std::size_t read_some(const MutableBufferSequence& buffers);

  /// Read some data from the stream. Returns the number of bytes read or 0 if
  /// an error occurred.
  template <typename MutableBufferSequence>
  std::size_t read_some(const MutableBufferSequence& buffers,
      boost::system::error_code& ec);

  /// Start an asynchronous read. The buffer into which the data will be read
  /// must be valid for the lifetime of the asynchronous operation.
  /**
   * @par Completion Signature
   * @code void(boost::system::error_code, std::size_t) @endcode
   */
  template <typename MutableBufferSequence,
      BOOST_ASIO_COMPLETION_TOKEN_FOR(void (boost::system::error_code,
        std::size_t)) ReadHandler
          BOOST_ASIO_DEFAULT_COMPLETION_TOKEN_TYPE(executor_type)>
  BOOST_ASIO_INITFN_AUTO_RESULT_TYPE_PREFIX(ReadHandler,
      void (boost::system::error_code, std::size_t))
  async_read_some(const MutableBufferSequence& buffers,
      BOOST_ASIO_MOVE_ARG(ReadHandler) handler
        BOOST_ASIO_DEFAULT_COMPLETION_TOKEN(executor_type))
    BOOST_ASIO_INITFN_AUTO_RESULT_TYPE_SUFFIX((
      async_initiate<ReadHandler,
        void (boost::system::error_code, std::size_t)>(
          declval<detail::initiate_async_buffered_read_some<Stream> >(),
          handler, declval<detail::buffered_stream_storage*>(), buffers)));

  /// Peek at the incoming data on the stream. Returns the number of bytes read.
  /// Throws an exception on failure.
  template <typename MutableBufferSequence>
  std::size_t peek(const MutableBufferSequence& buffers);

  /// Peek at the incoming data on the stream. Returns the number of bytes read,
  /// or 0 if an error occurred.
  template <typename MutableBufferSequence>
  std::size_t peek(const MutableBufferSequence& buffers,
      boost::system::error_code& ec);

  /// Determine the amount of data that may be read without blocking.
  std::size_t in_avail()
  {
    return storage_.size();
  }

  /// Determine the amount of data that may be read without blocking.
  std::size_t in_avail(boost::system::error_code& ec)
  {
    ec = boost::system::error_code();
    return storage_.size();
  }

private:
  /// Copy data out of the internal buffer to the specified target buffer.
  /// Returns the number of bytes copied.
  template <typename MutableBufferSequence>
  std::size_t copy(const MutableBufferSequence& buffers)
  {
    std::size_t bytes_copied = boost::asio::buffer_copy(
        buffers, storage_.data(), storage_.size());
    storage_.consume(bytes_copied);
    return bytes_copied;
  }

  /// Copy data from the internal buffer to the specified target buffer, without
  /// removing the data from the internal buffer. Returns the number of bytes
  /// copied.
  template <typename MutableBufferSequence>
  std::size_t peek_copy(const MutableBufferSequence& buffers)
  {
    return boost::asio::buffer_copy(buffers, storage_.data(), storage_.size());
  }

  /// The next layer.
  Stream next_layer_;

  // The data in the buffer.
  detail::buffered_stream_storage storage_;
};

} // namespace asio
} // namespace boost

#include <boost/asio/detail/pop_options.hpp>

#include <boost/asio/impl/buffered_read_stream.hpp>

#endif // BOOST_ASIO_BUFFERED_READ_STREAM_HPP
