//
// boost/process/v2/windows/default_launcher.hpp
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// Copyright (c) 2022 Klemens D. Morgenstern (klemens dot morgenstern at gmx dot net)
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
//

#ifndef BOOST_PROCESS_V2_WINDOWS_WITH_LOGON_LAUNCHER_HPP
#define BOOST_PROCESS_V2_WINDOWS_WITH_LOGON_LAUNCHER_HPP

#include <boost/process/v2/windows/default_launcher.hpp>

BOOST_PROCESS_V2_BEGIN_NAMESPACE
namespace windows
{

/// A windows launcher using CreateProcessWithLogon instead of CreateProcess
struct with_logon_launcher : default_launcher
{
  std::wstring username, password, domain;
  DWORD logon_flags{0u};

  with_logon_launcher(std::wstring username = L"",
                      std::wstring password = L"",
                      std::wstring domain = L"",
                      DWORD logon_flags = 0u) :
                      username(std::move(username)),
                      password(std::move(password)),
                      domain(std::move(domain)),
                      logon_flags(logon_flags)
  {
  }


  template<typename ExecutionContext, typename Args, typename ... Inits>
  auto operator()(ExecutionContext & context,
                  error_code & ec,
                  const typename std::enable_if<std::is_convertible<
                             ExecutionContext&, BOOST_PROCESS_V2_ASIO_NAMESPACE::execution_context&>::value,
                             filesystem::path >::type & executable,
                  Args && args,
                  Inits && ... inits ) -> basic_process<typename ExecutionContext::executor_type>
  {
      return (*this)(context.get_executor(), ec, executable, std::forward<Args>(args), std::forward<Inits>(inits)...);
  }


  template<typename ExecutionContext, typename Args, typename ... Inits>
  auto operator()(ExecutionContext & context,
                     const typename std::enable_if<std::is_convertible<
                             ExecutionContext&, BOOST_PROCESS_V2_ASIO_NAMESPACE::execution_context&>::value,
                             filesystem::path >::type & executable,
                     Args && args,
                     Inits && ... inits ) -> basic_process<typename ExecutionContext::executor_type>
  {
      return (*this)(context.get_executor(), executable, std::forward<Args>(args), std::forward<Inits>(inits)...);
  }

  template<typename Executor, typename Args, typename ... Inits>
  auto operator()(Executor exec,
                     const typename std::enable_if<
                             BOOST_PROCESS_V2_ASIO_NAMESPACE::execution::is_executor<Executor>::value ||
                             BOOST_PROCESS_V2_ASIO_NAMESPACE::is_executor<Executor>::value,
                             filesystem::path >::type & executable,
                     Args && args,
                     Inits && ... inits ) -> basic_process<Executor>
  {
      error_code ec;
      auto proc =  (*this)(std::move(exec), ec, executable, std::forward<Args>(args), std::forward<Inits>(inits)...);

      if (ec)
          v2::detail::throw_error(ec, "with_logon_launcher");

      return proc;
  }
  
  template<typename Executor, typename Args, typename ... Inits>
  auto operator()(Executor exec,
                     error_code & ec,
                     const typename std::enable_if<
                             BOOST_PROCESS_V2_ASIO_NAMESPACE::execution::is_executor<Executor>::value || 
                             BOOST_PROCESS_V2_ASIO_NAMESPACE::is_executor<Executor>::value,
                             filesystem::path >::type & executable,
                     Args && args,
                     Inits && ... inits ) -> basic_process<Executor>
  {
    auto command_line = this->build_command_line(executable, args);

    ec = detail::on_setup(*this, executable, command_line, inits...);
    if (ec)
    {
      detail::on_error(*this, executable, command_line, ec, inits...);
      return basic_process<Executor>(exec);
    }
    auto ok = ::CreateProcessWithLogonW(
        username.c_str(),
        domain.empty() ? nullptr : domain.c_str(),
        password.c_str(),
        logon_flags,
        executable.empty() ? nullptr : executable.c_str(),
        command_line.empty() ? nullptr : &command_line.front(),
        creation_flags,
        environment,
        current_directory.empty() ? nullptr : current_directory.c_str(),
        &startup_info.StartupInfo,
        &process_information);


    if (ok == 0)
    {
      BOOST_PROCESS_V2_ASSIGN_LAST_ERROR(ec)
      detail::on_error(*this, executable, command_line, ec, inits...);

      if (process_information.hProcess != INVALID_HANDLE_VALUE)
        ::CloseHandle(process_information.hProcess);
      if (process_information.hThread != INVALID_HANDLE_VALUE)
        ::CloseHandle(process_information.hThread);

      return basic_process<Executor>(exec);
    } else
    {
      detail::on_success(*this, executable, command_line, inits...);

      if (process_information.hThread != INVALID_HANDLE_VALUE)
        ::CloseHandle(process_information.hThread);

      return basic_process<Executor>(exec,
                                     this->process_information.dwProcessId,
                                     this->process_information.hProcess);
    }
  }
};

}
BOOST_PROCESS_V2_END_NAMESPACE

#endif //  BOOST_PROCESS_V2_WINDOWS_WITH_LOGON_LAUNCHER_HPP