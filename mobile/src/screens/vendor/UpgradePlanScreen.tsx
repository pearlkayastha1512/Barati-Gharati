import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { COLORS } from "../../constants/theme";
import { styles } from "./upgradePlanStyles";


export default function UpgradePlanScreen() {

  const [selectedPlan, setSelectedPlan] = useState("Bronze");

  const plans = [
    {
      name: "Bronze",
      price: "Free",
      description: "Basic vendor presence",
      features: [
        "Create vendor profile",
        "Add services",
        "Receive bookings",
      ],
      paymentRequired: false,
      icon: "medal-outline",
    },
    {
      name: "Silver",
      price: "₹999/month",
      description: "Grow your wedding business",
      features: [
        "Everything in Bronze",
        "Higher visibility",
        "More customer reach",
      ],
      paymentRequired: true,
      icon: "medal",
    },
    {
      name: "Gold",
      price: "₹1999/month",
      description: "Premium vendor growth",
      features: [
        "Everything in Silver",
        "Featured listing",
        "Priority support",
      ],
      paymentRequired: true,
      icon: "crown-outline",
    },
  ];


  const handlePlanSelect = (plan:any) => {
    setSelectedPlan(plan.name);

    if(plan.paymentRequired){
      // Later integrate Razorpay/Stripe here
      console.log("Payment required for", plan.name);
    }
    else{
      console.log("Bronze activated");
    }
  };


  return (
    <SafeAreaView style={styles.container}>

      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.title}>
          Upgrade Your Plan
        </Text>

        <Text style={styles.subtitle}>
          Choose a plan to grow your wedding business.
        </Text>


        {plans.map((plan)=>(
          <TouchableOpacity
            key={plan.name}
            style={[
              styles.card,
              selectedPlan === plan.name && styles.selectedCard
            ]}
            onPress={()=>handlePlanSelect(plan)}
          >

            <View style={styles.headerRow}>

              <MaterialCommunityIcons
                name={plan.icon as any}
                size={35}
                color={COLORS.primary}
              />

              <View>
                <Text style={styles.planName}>
                  {plan.name}
                </Text>

                <Text style={styles.price}>
                  {plan.price}
                </Text>
              </View>

            </View>


            <Text style={styles.description}>
              {plan.description}
            </Text>


            {plan.features.map((feature)=>(
              <View 
                key={feature}
                style={styles.featureRow}
              >

                <MaterialCommunityIcons
                  name="check-circle"
                  size={18}
                  color={COLORS.primary}
                />

                <Text style={styles.feature}>
                  {feature}
                </Text>

              </View>
            ))}


            <View style={styles.button}>
              <Text style={styles.buttonText}>
                {
                  plan.paymentRequired
                  ? "Upgrade & Pay"
                  : "Choose Free Plan"
                }
              </Text>
            </View>


          </TouchableOpacity>
        ))}

      </ScrollView>

    </SafeAreaView>
  );
}