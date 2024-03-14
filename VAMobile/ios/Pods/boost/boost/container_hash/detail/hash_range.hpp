// Copyright 2022 Peter Dimov
// Distributed under the Boost Software License, Version 1.0.
// https://www.boost.org/LICENSE_1_0.txt

#ifndef BOOST_HASH_DETAIL_HASH_RANGE_HPP
#define BOOST_HASH_DETAIL_HASH_RANGE_HPP

#include <boost/container_hash/hash_fwd.hpp>
#include <boost/container_hash/detail/mulx.hpp>
#include <boost/type_traits/integral_constant.hpp>
#include <boost/type_traits/enable_if.hpp>
#include <boost/type_traits/is_same.hpp>
#include <boost/cstdint.hpp>
#include <iterator>
#include <limits>
#include <cstddef>
#include <climits>
#include <cstring>

namespace boost
{
namespace hash_detail
{

template<class T> struct is_char_type: public boost::false_type {};

#if CHAR_BIT == 8

template<> struct is_char_type<char>: public boost::true_type {};
template<> struct is_char_type<signed char>: public boost::true_type {};
template<> struct is_char_type<unsigned char>: public boost::true_type {};

#if defined(__cpp_char8_t) && __cpp_char8_t >= 201811L
template<> struct is_char_type<char8_t>: public boost::true_type {};
#endif

#if defined(__cpp_lib_byte) && __cpp_lib_byte >= 201603L
template<> struct is_char_type<std::byte>: public boost::true_type {};
#endif

#endif

// generic version

template<class It>
inline typename boost::enable_if_<
    !is_char_type<typename std::iterator_traits<It>::value_type>::value,
std::size_t >::type
    hash_range( std::size_t seed, It first, It last )
{
    for( ; first != last; ++first )
    {
        hash_combine<typename std::iterator_traits<It>::value_type>( seed, *first );
    }

    return seed;
}

// specialized char[] version, 32 bit

template<class It> inline boost::uint32_t read32le( It p )
{
    // clang 5+, gcc 5+ figure out this pattern and use a single mov on x86
    // gcc on s390x and power BE even knows how to use load-reverse

    boost::uint32_t w =
        static_cast<boost::uint32_t>( static_cast<unsigned char>( p[0] ) ) |
        static_cast<boost::uint32_t>( static_cast<unsigned char>( p[1] ) ) <<  8 |
        static_cast<boost::uint32_t>( static_cast<unsigned char>( p[2] ) ) << 16 |
        static_cast<boost::uint32_t>( static_cast<unsigned char>( p[3] ) ) << 24;

    return w;
}

#if defined(_MSC_VER) && !defined(__clang__)

template<class T> inline boost::uint32_t read32le( T* p )
{
    boost::uint32_t w;

    std::memcpy( &w, p, 4 );
    return w;
}

#endif

inline boost::uint64_t mul32( boost::uint32_t x, boost::uint32_t y )
{
    return static_cast<boost::uint64_t>( x ) * y;
}

template<class It>
inline typename boost::enable_if_<
    is_char_type<typename std::iterator_traits<It>::value_type>::value &&
    is_same<typename std::iterator_traits<It>::iterator_category, std::random_access_iterator_tag>::value &&
    std::numeric_limits<std::size_t>::digits <= 32,
std::size_t>::type
    hash_range( std::size_t seed, It first, It last )
{
    It p = first;
    std::size_t n = static_cast<std::size_t>( last - first );

    boost::uint32_t const q = 0x9e3779b9U;
    boost::uint32_t const k = 0xe35e67b1U; // q * q

    boost::uint64_t h = mul32( static_cast<boost::uint32_t>( seed ) + q, k );
    boost::uint32_t w = static_cast<boost::uint32_t>( h & 0xFFFFFFFF );

    h ^= n;

    while( n >= 4 )
    {
        boost::uint32_t v1 = read32le( p );

        w += q;
        h ^= mul32( v1 + w, k );

        p += 4;
        n -= 4;
    }

    {
        boost::uint32_t v1 = 0;

        if( n >= 1 )
        {
            std::size_t const x1 = ( n - 1 ) & 2; // 1: 0, 2: 0, 3: 2
            std::size_t const x2 = n >> 1;        // 1: 0, 2: 1, 3: 1

            v1 =
                static_cast<boost::uint32_t>( static_cast<unsigned char>( p[ static_cast<std::ptrdiff_t>( x1 ) ] ) ) << x1 * 8 |
                static_cast<boost::uint32_t>( static_cast<unsigned char>( p[ static_cast<std::ptrdiff_t>( x2 ) ] ) ) << x2 * 8 |
                static_cast<boost::uint32_t>( static_cast<unsigned char>( p[ 0 ] ) );
        }

        w += q;
        h ^= mul32( v1 + w, k );
    }

    w += q;
    h ^= mul32( static_cast<boost::uint32_t>( h & 0xFFFFFFFF ) + w, static_cast<boost::uint32_t>( h >> 32 ) + w + k );

    return static_cast<boost::uint32_t>( h & 0xFFFFFFFF ) ^ static_cast<boost::uint32_t>( h >> 32 );
}

template<class It>
inline typename boost::enable_if_<
    is_char_type<typename std::iterator_traits<It>::value_type>::value &&
    !is_same<typename std::iterator_traits<It>::iterator_category, std::random_access_iterator_tag>::value &&
    std::numeric_limits<std::size_t>::digits <= 32,
std::size_t>::type
    hash_range( std::size_t seed, It first, It last )
{
    std::size_t n = 0;

    boost::uint32_t const q = 0x9e3779b9U;
    boost::uint32_t const k = 0xe35e67b1U; // q * q

    boost::uint64_t h = mul32( static_cast<boost::uint32_t>( seed ) + q, k );
    boost::uint32_t w = static_cast<boost::uint32_t>( h & 0xFFFFFFFF );

    boost::uint32_t v1 = 0;

    for( ;; )
    {
        v1 = 0;

        if( first == last )
        {
            break;
        }

        v1 |= static_cast<boost::uint32_t>( static_cast<unsigned char>( *first ) );
        ++first;
        ++n;

        if( first == last )
        {
            break;
        }

        v1 |= static_cast<boost::uint32_t>( static_cast<unsigned char>( *first ) ) << 8;
        ++first;
        ++n;

        if( first == last )
        {
            break;
        }

        v1 |= static_cast<boost::uint32_t>( static_cast<unsigned char>( *first ) ) << 16;
        ++first;
        ++n;

        if( first == last )
        {
            break;
        }

        v1 |= static_cast<boost::uint32_t>( static_cast<unsigned char>( *first ) ) << 24;
        ++first;
        ++n;

        w += q;
        h ^= mul32( v1 + w, k );
    }

    h ^= n;

    w += q;
    h ^= mul32( v1 + w, k );

    w += q;
    h ^= mul32( static_cast<boost::uint32_t>( h & 0xFFFFFFFF ) + w, static_cast<boost::uint32_t>( h >> 32 ) + w + k );

    return static_cast<boost::uint32_t>( h & 0xFFFFFFFF ) ^ static_cast<boost::uint32_t>( h >> 32 );
}

// specialized char[] version, 64 bit

template<class It> inline boost::uint64_t read64le( It p )
{
    boost::uint64_t w =
        static_cast<boost::uint64_t>( static_cast<unsigned char>( p[0] ) ) |
        static_cast<boost::uint64_t>( static_cast<unsigned char>( p[1] ) ) <<  8 |
        static_cast<boost::uint64_t>( static_cast<unsigned char>( p[2] ) ) << 16 |
        static_cast<boost::uint64_t>( static_cast<unsigned char>( p[3] ) ) << 24 |
        static_cast<boost::uint64_t>( static_cast<unsigned char>( p[4] ) ) << 32 |
        static_cast<boost::uint64_t>( static_cast<unsigned char>( p[5] ) ) << 40 |
        static_cast<boost::uint64_t>( static_cast<unsigned char>( p[6] ) ) << 48 |
        static_cast<boost::uint64_t>( static_cast<unsigned char>( p[7] ) ) << 56;

    return w;
}

#if defined(_MSC_VER) && !defined(__clang__)

template<class T> inline boost::uint64_t read64le( T* p )
{
    boost::uint64_t w;

    std::memcpy( &w, p, 8 );
    return w;
}

#endif

template<class It>
inline typename boost::enable_if_<
    is_char_type<typename std::iterator_traits<It>::value_type>::value &&
    is_same<typename std::iterator_traits<It>::iterator_category, std::random_access_iterator_tag>::value &&
    (std::numeric_limits<std::size_t>::digits > 32),
std::size_t>::type
    hash_range( std::size_t seed, It first, It last )
{
    It p = first;
    std::size_t n = static_cast<std::size_t>( last - first );

    boost::uint64_t const q = static_cast<boost::uint64_t>( 0x9e3779b9 ) << 32 | 0x7f4a7c15;
    boost::uint64_t const k = static_cast<boost::uint64_t>( 0xdf442d22 ) << 32 | 0xce4859b9; // q * q

    boost::uint64_t w = mulx( seed + q, k );
    boost::uint64_t h = w ^ n;

    while( n >= 8 )
    {
        boost::uint64_t v1 = read64le( p );

        w += q;
        h ^= mulx( v1 + w, k );

        p += 8;
        n -= 8;
    }

    {
        boost::uint64_t v1 = 0;

        if( n >= 4 )
        {
            v1 = static_cast<boost::uint64_t>( read32le( p + static_cast<std::ptrdiff_t>( n - 4 ) ) ) << ( n - 4 ) * 8 | read32le( p );
        }
        else if( n >= 1 )
        {
            std::size_t const x1 = ( n - 1 ) & 2; // 1: 0, 2: 0, 3: 2
            std::size_t const x2 = n >> 1;        // 1: 0, 2: 1, 3: 1

            v1 =
                static_cast<boost::uint64_t>( static_cast<unsigned char>( p[ static_cast<std::ptrdiff_t>( x1 ) ] ) ) << x1 * 8 |
                static_cast<boost::uint64_t>( static_cast<unsigned char>( p[ static_cast<std::ptrdiff_t>( x2 ) ] ) ) << x2 * 8 |
                static_cast<boost::uint64_t>( static_cast<unsigned char>( p[ 0 ] ) );
        }

        w += q;
        h ^= mulx( v1 + w, k );
    }

    return mulx( h + w, k );
}

template<class It>
inline typename boost::enable_if_<
    is_char_type<typename std::iterator_traits<It>::value_type>::value &&
    !is_same<typename std::iterator_traits<It>::iterator_category, std::random_access_iterator_tag>::value &&
    (std::numeric_limits<std::size_t>::digits > 32),
std::size_t>::type
    hash_range( std::size_t seed, It first, It last )
{
    std::size_t n = 0;

    boost::uint64_t const q = static_cast<boost::uint64_t>( 0x9e3779b9 ) << 32 | 0x7f4a7c15;
    boost::uint64_t const k = static_cast<boost::uint64_t>( 0xdf442d22 ) << 32 | 0xce4859b9; // q * q

    boost::uint64_t w = mulx( seed + q, k );
    boost::uint64_t h = w;

    boost::uint64_t v1 = 0;

    for( ;; )
    {
        v1 = 0;

        if( first == last )
        {
            break;
        }

        v1 |= static_cast<boost::uint64_t>( static_cast<unsigned char>( *first ) );
        ++first;
        ++n;

        if( first == last )
        {
            break;
        }

        v1 |= static_cast<boost::uint64_t>( static_cast<unsigned char>( *first ) ) << 8;
        ++first;
        ++n;

        if( first == last )
        {
            break;
        }

        v1 |= static_cast<boost::uint64_t>( static_cast<unsigned char>( *first ) ) << 16;
        ++first;
        ++n;

        if( first == last )
        {
            break;
        }

        v1 |= static_cast<boost::uint64_t>( static_cast<unsigned char>( *first ) ) << 24;
        ++first;
        ++n;

        if( first == last )
        {
            break;
        }

        v1 |= static_cast<boost::uint64_t>( static_cast<unsigned char>( *first ) ) << 32;
        ++first;
        ++n;

        if( first == last )
        {
            break;
        }

        v1 |= static_cast<boost::uint64_t>( static_cast<unsigned char>( *first ) ) << 40;
        ++first;
        ++n;

        if( first == last )
        {
            break;
        }

        v1 |= static_cast<boost::uint64_t>( static_cast<unsigned char>( *first ) ) << 48;
        ++first;
        ++n;

        if( first == last )
        {
            break;
        }

        v1 |= static_cast<boost::uint64_t>( static_cast<unsigned char>( *first ) ) << 56;
        ++first;
        ++n;

        w += q;
        h ^= mulx( v1 + w, k );
    }

    h ^= n;

    w += q;
    h ^= mulx( v1 + w, k );

    return mulx( h + w, k );
}

} // namespace hash_detail
} // namespace boost

#endif // #ifndef BOOST_HASH_DETAIL_HASH_RANGE_HPP
