// Copyright 2019 Google
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * This class is a model to identify a single execution of the app
 */
@interface FIRCLSExecutionIdentifierModel : NSObject

/**
 * Returns the launch identifier. This is a unique id that will remain constant until this process
 * is relaunched. This value is useful for correlating events across kits and/or across reports at
 * the process-lifecycle level.
 */
@property(nonatomic, readonly) NSString *executionID;

@end

NS_ASSUME_NONNULL_END
