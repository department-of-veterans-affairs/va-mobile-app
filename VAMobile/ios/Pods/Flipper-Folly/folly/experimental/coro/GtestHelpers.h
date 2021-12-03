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

#pragma once

#include <folly/experimental/coro/BlockingWait.h>
#include <folly/experimental/coro/Coroutine.h>
#include <folly/experimental/coro/Task.h>
#include <folly/portability/GTest.h>

#if FOLLY_HAS_COROUTINES

/**
 * This is based on the GTEST_TEST_ macro from gtest-internal.h. It seems that
 * gtest doesn't yet support coro tests, so this macro adds a way to define a
 * test case written as a coroutine using folly::coro::Task. It will be called
 * using folly::coro::blockingWait().
 *
 * Note that you cannot use ASSERT macros in coro tests. See below for
 * CO_ASSERT_*.
 */
#define CO_TEST_MASTER_(test_case_name, test_name, parent_class, parent_id) \
  class GTEST_TEST_CLASS_NAME_(test_case_name, test_name)                   \
      : public parent_class {                                               \
   public:                                                                  \
    GTEST_TEST_CLASS_NAME_(test_case_name, test_name)() {}                  \
                                                                            \
   private:                                                                 \
    void TestBody() override;                                               \
    folly::coro::Task<void> co_TestBody();                                  \
    static ::testing::TestInfo* const test_info_ GTEST_ATTRIBUTE_UNUSED_;   \
    GTEST_DISALLOW_COPY_AND_ASSIGN_(                                        \
        GTEST_TEST_CLASS_NAME_(test_case_name, test_name));                 \
  };                                                                        \
                                                                            \
  ::testing::TestInfo* const GTEST_TEST_CLASS_NAME_(                        \
      test_case_name, test_name)::test_info_ =                              \
      ::testing::internal::MakeAndRegisterTestInfo(                         \
          GTEST_STRINGIFY_TOKEN_(test_case_name),                           \
          GTEST_STRINGIFY_TOKEN_(test_name),                                \
          NULL,                                                             \
          NULL,                                                             \
          ::testing::internal::CodeLocation(__FILE__, __LINE__),            \
          (parent_id),                                                      \
          parent_class::SetUpTestCase,                                      \
          parent_class::TearDownTestCase,                                   \
          new ::testing::internal::TestFactoryImpl<GTEST_TEST_CLASS_NAME_(  \
              test_case_name, test_name)>);                                 \
  void GTEST_TEST_CLASS_NAME_(test_case_name, test_name)::TestBody() {      \
    folly::coro::blockingWait(co_TestBody());                               \
  }                                                                         \
  folly::coro::Task<void> GTEST_TEST_CLASS_NAME_(                           \
      test_case_name, test_name)::co_TestBody()

#define CO_TEST_20201023_(test_suite_name, test_name, parent_class, parent_id) \
  static_assert(                                                               \
      sizeof(GTEST_STRINGIFY_(test_suite_name)) > 1,                           \
      "test_suite_name must not be empty");                                    \
  static_assert(                                                               \
      sizeof(GTEST_STRINGIFY_(test_name)) > 1, "test_name must not be empty"); \
  class GTEST_TEST_CLASS_NAME_(test_suite_name, test_name)                     \
      : public parent_class {                                                  \
   public:                                                                     \
    GTEST_TEST_CLASS_NAME_(test_suite_name, test_name)() = default;            \
    ~GTEST_TEST_CLASS_NAME_(test_suite_name, test_name)() override = default;  \
    GTEST_DISALLOW_COPY_AND_ASSIGN_(                                           \
        GTEST_TEST_CLASS_NAME_(test_suite_name, test_name));                   \
    GTEST_DISALLOW_MOVE_AND_ASSIGN_(                                           \
        GTEST_TEST_CLASS_NAME_(test_suite_name, test_name));                   \
                                                                               \
   private:                                                                    \
    void TestBody() override;                                                  \
    folly::coro::Task<void> co_TestBody();                                     \
    static ::testing::TestInfo* const test_info_ GTEST_ATTRIBUTE_UNUSED_;      \
  };                                                                           \
                                                                               \
  ::testing::TestInfo* const GTEST_TEST_CLASS_NAME_(                           \
      test_suite_name, test_name)::test_info_ =                                \
      ::testing::internal::MakeAndRegisterTestInfo(                            \
          #test_suite_name,                                                    \
          #test_name,                                                          \
          nullptr,                                                             \
          nullptr,                                                             \
          ::testing::internal::CodeLocation(__FILE__, __LINE__),               \
          (parent_id),                                                         \
          ::testing::internal::SuiteApiResolver<                               \
              parent_class>::GetSetUpCaseOrSuite(__FILE__, __LINE__),          \
          ::testing::internal::SuiteApiResolver<                               \
              parent_class>::GetTearDownCaseOrSuite(__FILE__, __LINE__),       \
          new ::testing::internal::TestFactoryImpl<GTEST_TEST_CLASS_NAME_(     \
              test_suite_name, test_name)>);                                   \
  void GTEST_TEST_CLASS_NAME_(test_suite_name, test_name)::TestBody() {        \
    folly::coro::blockingWait(co_TestBody());                                  \
  }                                                                            \
  folly::coro::Task<void> GTEST_TEST_CLASS_NAME_(                              \
      test_suite_name, test_name)::co_TestBody()

#if defined(TYPED_TEST_SUITE)
#define CO_TEST_ CO_TEST_20201023_
#else
#define CO_TEST_ CO_TEST_MASTER_
#endif

/**
 * TEST() for coro tests.
 */
#define CO_TEST(test_case_name, test_name) \
  CO_TEST_(                                \
      test_case_name,                      \
      test_name,                           \
      ::testing::Test,                     \
      ::testing::internal::GetTestTypeId())

/**
 * TEST_F() for coro tests.
 */
#define CO_TEST_F(test_fixture, test_name) \
  CO_TEST_(                                \
      test_fixture,                        \
      test_name,                           \
      test_fixture,                        \
      ::testing::internal::GetTypeId<test_fixture>())

/**
 * Coroutine versions of GTests's Assertion predicate macros. Use these in place
 * of ASSERT_* in CO_TEST or coroutine functions.
 */
#define CO_GTEST_FATAL_FAILURE_(message) \
  co_return GTEST_MESSAGE_(message, ::testing::TestPartResult::kFatalFailure)
#define CO_ASSERT_PRED_FORMAT2(pred_format, v1, v2) \
  GTEST_PRED_FORMAT2_(pred_format, v1, v2, CO_GTEST_FATAL_FAILURE_)

#define CO_ASSERT_TRUE(condition) \
  GTEST_TEST_BOOLEAN_(            \
      (condition), #condition, false, true, CO_GTEST_FATAL_FAILURE_)
#define CO_ASSERT_FALSE(condition) \
  GTEST_TEST_BOOLEAN_(             \
      !(condition), #condition, true, false, CO_GTEST_FATAL_FAILURE_)

#if defined(GTEST_IS_NULL_LITERAL_)
#define CO_ASSERT_EQ(val1, val2)                                            \
  CO_ASSERT_PRED_FORMAT2(                                                   \
      ::testing::internal::EqHelper<GTEST_IS_NULL_LITERAL_(val1)>::Compare, \
      val1,                                                                 \
      val2)
#else
#define CO_ASSERT_EQ(val1, val2) \
  CO_ASSERT_PRED_FORMAT2(::testing::internal::EqHelper::Compare, val1, val2)
#endif

#define CO_ASSERT_NE(val1, val2) \
  CO_ASSERT_PRED_FORMAT2(::testing::internal::CmpHelperNE, val1, val2)
#define CO_ASSERT_LE(val1, val2) \
  CO_ASSERT_PRED_FORMAT2(::testing::internal::CmpHelperLE, val1, val2)
#define CO_ASSERT_LT(val1, val2) \
  CO_ASSERT_PRED_FORMAT2(::testing::internal::CmpHelperLT, val1, val2)
#define CO_ASSERT_GE(val1, val2) \
  CO_ASSERT_PRED_FORMAT2(::testing::internal::CmpHelperGE, val1, val2)
#define CO_ASSERT_GT(val1, val2) \
  CO_ASSERT_PRED_FORMAT2(::testing::internal::CmpHelperGT, val1, val2)

#endif // FOLLY_HAS_COROUTINES
