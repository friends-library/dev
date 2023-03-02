#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

/**
 * Added by jared @see https://github.com/crazycodeboy/react-native-splash-screen
 */
#import "RNSplashScreen.h"

/**
 * Added by jared @see https://github.com/flowkey/react-native-home-indicator
 */
#import <RNHomeIndicator.h>

/**
 * Added by jared @see https://github.com/wonday/react-native-orientation-locker
 */
#import "Orientation.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"FriendsLibrary";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  /**
   * Changed by jared @see https://github.com/crazycodeboy/react-native-splash-screen
   * also @see https://github.com/crazycodeboy/react-native-splash-screen/issues/606#issuecomment-1396914012
   */
  [super application:application didFinishLaunchingWithOptions:launchOptions];
  [RNSplashScreen show];
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (UIViewController *)createRootViewController
{
  return [HomeIndicatorViewController new];
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  return true;
}

/**
 * Added by jared @see https://github.com/wonday/react-native-orientation-locker
 */
- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
  return [Orientation getOrientation];
}

@end
