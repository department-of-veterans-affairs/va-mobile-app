// Copyright Sebastian Ramacher, 2007.
// Distributed under the Boost Software License, Version 1.0. (See
// accompanying file LICENSE_1_0.txt or copy at
// http://www.boost.org/LICENSE_1_0.txt)

#ifndef BOOST_PTR_CONTAINER_SERIALIZE_PTR_LIST_HPP
#define BOOST_PTR_CONTAINER_SERIALIZE_PTR_LIST_HPP

#include <boost/ptr_container/detail/serialize_reversible_cont.hpp>
#include <boost/ptr_container/ptr_list.hpp>

namespace boost 
{

namespace serialization 
{

template<class Archive, class T, class CloneAllocator, class Allocator>
void serialize(Archive& ar, ptr_list<T, CloneAllocator, Allocator>& c, const unsigned int version)
{
   core::split_free(ar, c, version);
}

} // namespace serialization
} // namespace boost

#endif
