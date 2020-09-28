//  (C) Copyright 2016 Raffi Enficiaud.
//  Distributed under the Boost Software License, Version 1.0.
//  (See accompanying file LICENSE_1_0.txt or copy at
//  http://www.boost.org/LICENSE_1_0.txt)

//  See http://www.boost.org/libs/test for the library home page.
//
///@file
///@brief Contains the definition of the Junit log formatter (OF_JUNIT)
// ***************************************************************************

#ifndef BOOST_TEST_JUNIT_LOG_FORMATTER__
#define BOOST_TEST_JUNIT_LOG_FORMATTER__

// Boost.Test
#include <boost/test/detail/global_typedef.hpp>
#include <boost/test/unit_test_log_formatter.hpp>
#include <boost/test/tree/test_unit.hpp>

//#include <boost/test/results_collector.hpp>

// STL
#include <cstddef> // std::size_t
#include <map>
#include <list>

#include <boost/test/detail/suppress_warnings.hpp>

//____________________________________________________________________________//

namespace boost {
namespace unit_test {
namespace output {


  namespace junit_impl {

    // helper for the JUnit logger
    struct junit_log_helper
    {
      struct assertion_entry {

        enum log_entry_t {
          log_entry_info,
          log_entry_error,
          log_entry_failure
        };

        assertion_entry() : sealed(false)
        {}

        std::string logentry_message;
        std::string logentry_type; // the one that will get expanded in the final junit (failure, error)
        std::string output;        // additional information/message generated by the assertion

        log_entry_t log_entry;     // the type associated to the assertion (or error)

        bool sealed;               // indicates if the entry can accept additional information
      };

      std::string system_out;      // sysout: additional information
      std::string system_err;      // syserr: additional information

      // list of failure, errors and messages (assertions message and the full log)
      std::vector< assertion_entry > assertion_entries;

    };
  }

// ************************************************************************** //
// **************               junit_log_formatter              ************** //
// ************************************************************************** //

/// JUnit logger class
class junit_log_formatter : public unit_test_log_formatter {
public:

    junit_log_formatter() : m_display_build_info(false)
    {
      this->m_log_level = log_successful_tests;
    }

    // Formatter interface
    void    log_start( std::ostream&, counter_t test_cases_amount );
    void    log_finish( std::ostream& );
    void    log_build_info( std::ostream& );

    void    test_unit_start( std::ostream&, test_unit const& tu );
    void    test_unit_finish( std::ostream&, test_unit const& tu, unsigned long elapsed );
    void    test_unit_skipped( std::ostream&, test_unit const& tu, const_string reason );
    void    test_unit_aborted( std::ostream& os, test_unit const& tu );

    void    log_exception_start( std::ostream&, log_checkpoint_data const&, execution_exception const& ex );
    void    log_exception_finish( std::ostream& );

    void    log_entry_start( std::ostream&, log_entry_data const&, log_entry_types let );

    using   unit_test_log_formatter::log_entry_value; // bring base class functions into overload set
    void    log_entry_value( std::ostream&, const_string value );
    void    log_entry_finish( std::ostream& );

    void    entry_context_start( std::ostream&, log_level );
    void    log_entry_context( std::ostream&, const_string );
    void    entry_context_finish( std::ostream& );

    //! Discards changes in the log level
    virtual void        set_log_level(log_level )
    {
    }

    //! Instead of a regular stream, returns a file name corresponding to
    //! the current master test suite. If the file already exists, adds an index
    //! to it.
    virtual std::string  get_default_stream_description() const;


private:
    typedef std::map<test_unit_id, junit_impl::junit_log_helper> map_trace_t;
    map_trace_t map_tests;

    std::list<test_unit_id> list_path_to_root;
    test_unit_id root_id;
    bool m_display_build_info;
    bool m_is_last_assertion_or_error; // true if failure, false if error

    friend class junit_result_helper;
};

} // namespace output
} // namespace unit_test
} // namespace boost

#include <boost/test/detail/enable_warnings.hpp>

#endif // BOOST_TEST_JUNIT_LOG_FORMATTER__
