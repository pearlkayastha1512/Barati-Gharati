// // import React, { useEffect, useRef } from "react";
// // import {
// //   View,
// //   StyleSheet,
// //   Animated,
// //   Easing,
// //   ActivityIndicator,
// // } from "react-native";
// // import { StatusBar } from "expo-status-bar";
// // import { useNavigation } from "@react-navigation/native";

// // // import { useAuthStore } from "../../store/authStore";
// // // import { useAppStore } from "../../store/appStore";
// // import { useAuthStore } from "../../store/authStore";
// // import { getOnboardingStatus } from "../../utils/secureStore";
// // import { UserRole } from "../../types/user";
// // export default function SplashScreen() {
// //   // const navigation = useNavigation<any>();
// //   const {
// //   restoreSession,
// //   isAuthenticated,
// //   user,
// // } = useAuthStore();

// //   const logoOpacity = useRef(new Animated.Value(0)).current;
// //   const logoScale = useRef(new Animated.Value(0.8)).current;
// //   const textOpacity = useRef(new Animated.Value(0)).current;

// //   useEffect(() => {
// //     console.log("🔥 Splash mounted");

// //     Animated.sequence([
// //       Animated.parallel([
// //         Animated.timing(logoOpacity, {
// //           toValue: 1,
// //           duration: 1200,
// //           useNativeDriver: true,
// //         }),
// //         Animated.spring(logoScale, {
// //           toValue: 1,
// //           friction: 5,
// //           useNativeDriver: true,
// //         }),
// //       ]),
// //       Animated.timing(textOpacity, {
// //         toValue: 1,
// //         duration: 700,
// //         easing: Easing.ease,
// //         useNativeDriver: true,
// //       }),
// //     ]).start();

// //     // TODO:
// //     // Later restore session and navigate to:
// //     // Auth / Couple / Vendor

// //     // const timer = setTimeout(() => {
// //     //   navigation.replace("Onboarding");
// //     // }, 2500);

// //     // return () => clearTimeout(timer);
// //     const initializeApp = async () => {
// //   try {
// //     await restoreSession();

// //     const onboardingCompleted =
// //       await getOnboardingStatus();

// //     setTimeout(() => {
// //       const {
// //         isAuthenticated,
// //         user,
// //       } = useAuthStore.getState();

// //       if (
// //         isAuthenticated &&
// //         user
// //       ) {
// //         if (
// //           user.role === UserRole.VENDOR
// //         ) {
// //           navigation.replace(
// //             "Vendor",
// //           );

// //           return;
// //         }

// //         // if (
// //         //   user.role === UserRole.ADMIN
// //         // ) {
// //         //   navigation.replace(
// //         //     "Admin",
// //         //   );

// //         //   return;
// //         // }

// //         navigation.replace(
// //           "Couple",
// //         );

// //         return;
// //       }

// //       if (
// //         onboardingCompleted
// //       ) {
// //         navigation.replace(
// //           "Auth",
// //         );
// //       } else {
// //         navigation.replace(
// //           "Onboarding",
// //         );
// //       }
// //     }, 2500);
// //   } catch (error) {
// //     navigation.replace("Auth");
// //   }
// // };

// // initializeApp();
// //   }, []);

// //   return (
// //     <View style={styles.container}>
// //       <StatusBar style="dark" />

// //       <Animated.Image
// //         source={require("../../../assets/Barati Gharati Logo new.png")}
// //         style={[
// //           styles.logo,
// //           {
// //             opacity: logoOpacity,
// //             transform: [{ scale: logoScale }],
// //           },
// //         ]}
// //       />

// //       <Animated.Text
// //         style={[
// //           styles.subtitle,
// //           {
// //             opacity: textOpacity,
// //           },
// //         ]}
// //       >
// //         Plan Your Dream Wedding
// //       </Animated.Text>

// //       <View style={styles.divider} />

// //       <ActivityIndicator
// //         size="large"
// //         color="#C2185B"
// //       />

// //       <Animated.Text
// //         style={[
// //           styles.loading,
// //           {
// //             opacity: textOpacity,
// //           },
// //         ]}
// //       >
// //         Loading...
// //       </Animated.Text>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: "#FFF8F5",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     paddingHorizontal: 25,
// //   },
// //   logo: {
// //     width: 280,
// //     height: 180,
// //     resizeMode: "contain",
// //   },
// //   subtitle: {
// //     marginTop: 15,
// //     fontSize: 18,
// //     color: "#C2185B",
// //     fontWeight: "500",
// //   },
// //   divider: {
// //     marginTop: 18,
// //     width: 180,
// //     height: 2,
// //     backgroundColor: "#F3A6C7",
// //     borderRadius: 10,
// //   },
// //   loading: {
// //     marginTop: 15,
// //     fontSize: 16,
// //     color: "#C2185B",
// //   },
// // });

// import React, { useEffect, useRef } from "react";
// import {
//   View,
//   StyleSheet,
//   Animated,
//   Easing,
//   ActivityIndicator,
// } from "react-native";
// import { StatusBar } from "expo-status-bar";
// import { useNavigation } from "@react-navigation/native";

// import { useAuthStore } from "../../store/authStore";
// import { getOnboardingStatus } from "../../utils/secureStore";
// import { UserRole } from "../../types/user";

// export default function SplashScreen() {
//   const navigation = useNavigation<any>();

//   const { restoreSession } = useAuthStore();

//   const logoOpacity = useRef(new Animated.Value(0)).current;
//   const logoScale = useRef(new Animated.Value(0.8)).current;
//   const textOpacity = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     console.log("🔥 Splash mounted");

//     Animated.sequence([
//       Animated.parallel([
//         Animated.timing(logoOpacity, {
//           toValue: 1,
//           duration: 1200,
//           useNativeDriver: true,
//         }),
//         Animated.spring(logoScale, {
//           toValue: 1,
//           friction: 5,
//           useNativeDriver: true,
//         }),
//       ]),
//       Animated.timing(textOpacity, {
//         toValue: 1,
//         duration: 700,
//         easing: Easing.ease,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     let timer: ReturnType<typeof setTimeout>;

//     const initializeApp = async () => {
//   try {
//     // await restoreSession(); // TEMP: disabled so Auth screen always shows during dev

//     const onboardingCompleted = await getOnboardingStatus();

//     timer = setTimeout(() => {
//       const { isAuthenticated, user } = useAuthStore.getState();

//       if (isAuthenticated && user) {
//         if (user.role === UserRole.VENDOR) {
//           navigation.navigate("Vendor");
//           return;
//         }

//         navigation.navigate("Couple");
//         return;
//       }

//       if (onboardingCompleted) {
//         navigation.navigate("Auth");
//       } else {
//         navigation.navigate("Onboarding");
//       }
//     }, 2500);
//   } catch (error) {
//     navigation.navigate("Auth");
//   }
// };

//     initializeApp();

//     return () => {
//       if (timer) {
//         clearTimeout(timer);
//       }
//     };
//   }, []);

//   return (
//     <View style={styles.container}>
//       <StatusBar style="dark" />

//       <Animated.Image
//         source={require("../../../assets/Barati Gharati Logo new.png")}
//         style={[
//           styles.logo,
//           {
//             opacity: logoOpacity,
//             transform: [{ scale: logoScale }],
//           },
//         ]}
//       />

//       <Animated.Text
//         style={[
//           styles.subtitle,
//           {
//             opacity: textOpacity,
//           },
//         ]}
//       >
//         Plan Your Dream Wedding
//       </Animated.Text>

//       <View style={styles.divider} />

//       <ActivityIndicator
//         size="large"
//         color="#C2185B"
//       />

//       <Animated.Text
//         style={[
//           styles.loading,
//           {
//             opacity: textOpacity,
//           },
//         ]}
//       >
//         Loading...
//       </Animated.Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFF8F5",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 25,
//   },

//   logo: {
//     width: 280,
//     height: 180,
//     resizeMode: "contain",
//   },

//   subtitle: {
//     marginTop: 15,
//     fontSize: 18,
//     color: "#C2185B",
//     fontWeight: "500",
//   },

//   divider: {
//     marginTop: 18,
//     width: 180,
//     height: 2,
//     backgroundColor: "#F3A6C7",
//     borderRadius: 10,
//   },

//   loading: {
//     marginTop: 15,
//     fontSize: 16,
//     color: "#C2185B",
//   },
// });
import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

import { useAuthStore } from "../../store/authStore";
import { getOnboardingStatus } from "../../utils/secureStore";
import { UserRole } from "../../types/user";

const { width } = Dimensions.get("window");

export default function SplashScreen() {
  const navigation = useNavigation<any>();

  const { restoreSession } = useAuthStore();

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(10)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const dividerScale = useRef(new Animated.Value(0)).current;

  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    console.log("🔥 Splash mounted");

    Animated.sequence([
      Animated.parallel([
        Animated.timing(badgeOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(dividerScale, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const pulseDot = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 450,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 450,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ]),
      );

    pulseDot(dot1, 0).start();
    pulseDot(dot2, 150).start();
    pulseDot(dot3, 300).start();

    let timer: ReturnType<typeof setTimeout>;

    const initializeApp = async () => {
      try {
        // await restoreSession(); // TEMP: disabled so Auth screen always shows during dev

        const onboardingCompleted = await getOnboardingStatus();

        timer = setTimeout(() => {
          const { isAuthenticated, user } = useAuthStore.getState();

          if (isAuthenticated && user) {
            if (user.role === UserRole.VENDOR) {
              navigation.navigate("Vendor");
              return;
            }

            navigation.navigate("Couple");
            return;
          }

          if (onboardingCompleted) {
            navigation.navigate("Auth");
          } else {
            navigation.navigate("Onboarding");
          }
        }, 2500);
      } catch (error) {
        navigation.navigate("Auth");
      }
    };

    initializeApp();

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Soft decorative background blobs for depth, matching the app's warm palette */}
      <View style={styles.blobTopRight} />
      <View style={styles.blobBottomLeft} />

      <Animated.View style={[styles.badge, { opacity: badgeOpacity }]}>
        <Text style={styles.badgeText}>✨ WEDDING PLANNING, SIMPLIFIED</Text>
      </Animated.View>

      <Animated.Image
        source={require("../../../assets/Barati Gharati Logo new.png")}
        style={[
          styles.logo,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      />

      <Animated.Text
        style={[
          styles.subtitle,
          {
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }],
          },
        ]}
      >
        Plan Your Dream Wedding
      </Animated.Text>

      <Animated.View style={{ transform: [{ scaleX: dividerScale }] }}>
        <LinearGradient
          colors={["#E01267", "#F5A623"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.divider}
        />
      </Animated.View>

      <View style={styles.dotsRow}>
        <Animated.View style={[styles.dot, { opacity: dot1 }]} />
        <Animated.View style={[styles.dot, { opacity: dot2 }]} />
        <Animated.View style={[styles.dot, { opacity: dot3 }]} />
      </View>

      <Animated.Text style={[styles.loading, { opacity: textOpacity }]}>
        Loading...
      </Animated.Text>
    </View>
  );
}

import { Text } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F5",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
    overflow: "hidden",
  },

  blobTopRight: {
    position: "absolute",
    top: -80,
    right: -60,
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: "#FFE6EB",
    opacity: 0.6,
  },

  blobBottomLeft: {
    position: "absolute",
    bottom: -100,
    left: -80,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: "#FFF3D6",
    opacity: 0.5,
  },

  badge: {
    marginBottom: 22,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FFCAD3",
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    color: "#C2185B",
  },

  logo: {
    width: 280,
    height: 180,
    resizeMode: "contain",
  },

  subtitle: {
    marginTop: 15,
    fontSize: 19,
    color: "#3F1D2F",
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  divider: {
    marginTop: 18,
    width: 180,
    height: 3,
    borderRadius: 10,
  },

  dotsRow: {
    marginTop: 28,
    flexDirection: "row",
    gap: 8,
  },

  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#E01267",
  },

  loading: {
    marginTop: 14,
    fontSize: 14,
    color: "#8D6171",
    fontWeight: "500",
  },
});