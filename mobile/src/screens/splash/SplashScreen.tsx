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

// // import { useAuthStore } from "../../store/authStore";
// // import { useAppStore } from "../../store/appStore";
// import { useAuthStore } from "../../store/authStore";
// import { getOnboardingStatus } from "../../utils/secureStore";
// import { UserRole } from "../../types/user";
// export default function SplashScreen() {
//   // const navigation = useNavigation<any>();
//   const {
//   restoreSession,
//   isAuthenticated,
//   user,
// } = useAuthStore();

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

//     // TODO:
//     // Later restore session and navigate to:
//     // Auth / Couple / Vendor

//     // const timer = setTimeout(() => {
//     //   navigation.replace("Onboarding");
//     // }, 2500);

//     // return () => clearTimeout(timer);
//     const initializeApp = async () => {
//   try {
//     await restoreSession();

//     const onboardingCompleted =
//       await getOnboardingStatus();

//     setTimeout(() => {
//       const {
//         isAuthenticated,
//         user,
//       } = useAuthStore.getState();

//       if (
//         isAuthenticated &&
//         user
//       ) {
//         if (
//           user.role === UserRole.VENDOR
//         ) {
//           navigation.replace(
//             "Vendor",
//           );

//           return;
//         }

//         // if (
//         //   user.role === UserRole.ADMIN
//         // ) {
//         //   navigation.replace(
//         //     "Admin",
//         //   );

//         //   return;
//         // }

//         navigation.replace(
//           "Couple",
//         );

//         return;
//       }

//       if (
//         onboardingCompleted
//       ) {
//         navigation.replace(
//           "Auth",
//         );
//       } else {
//         navigation.replace(
//           "Onboarding",
//         );
//       }
//     }, 2500);
//   } catch (error) {
//     navigation.replace("Auth");
//   }
// };

// initializeApp();
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
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";

import { useAuthStore } from "../../store/authStore";
import { getOnboardingStatus } from "../../utils/secureStore";
import { UserRole } from "../../types/user";

export default function SplashScreen() {
  const navigation = useNavigation<any>();

  const { restoreSession } = useAuthStore();

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log("🔥 Splash mounted");

    Animated.sequence([
      Animated.parallel([
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
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 700,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();

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
          },
        ]}
      >
        Plan Your Dream Wedding
      </Animated.Text>

      <View style={styles.divider} />

      <ActivityIndicator
        size="large"
        color="#C2185B"
      />

      <Animated.Text
        style={[
          styles.loading,
          {
            opacity: textOpacity,
          },
        ]}
      >
        Loading...
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F5",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },

  logo: {
    width: 280,
    height: 180,
    resizeMode: "contain",
  },

  subtitle: {
    marginTop: 15,
    fontSize: 18,
    color: "#C2185B",
    fontWeight: "500",
  },

  divider: {
    marginTop: 18,
    width: 180,
    height: 2,
    backgroundColor: "#F3A6C7",
    borderRadius: 10,
  },

  loading: {
    marginTop: 15,
    fontSize: 16,
    color: "#C2185B",
  },
});