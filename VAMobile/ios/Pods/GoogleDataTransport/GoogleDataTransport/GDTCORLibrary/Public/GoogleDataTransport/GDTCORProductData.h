// Copyright 2023 Google LLC
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

@interface GDTCORProductData : NSObject <NSCopying, NSSecureCoding>

/// The product ID.
@property(nonatomic, readonly) int32_t productID;

/// Initializes an instance using the given product ID.
/// - Parameter productID: A 32-bit integer.
- (instancetype)initWithProductID:(int32_t)productID;

/// This API is unavailable.
- (instancetype)init NS_UNAVAILABLE;

@end
