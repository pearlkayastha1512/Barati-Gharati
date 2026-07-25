import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { styles } from "./styles/PlanMyWeddingScreen.styles";
import { premiumPlanningApi } from "../../api/premiumPlanning.api";
import {
  PremiumPlanningRequest,
  PremiumPlanningStatus,
} from "../../types/premiumPlanning";
import { PlanMyWeddingForm } from "./PlanMyWeddingForm";
import { SafeAreaView } from "react-native-safe-area-context";

const STEPS = [
  { key: "preferences", label: "Preferences" },
  { key: "review", label: "Team review" },
  { key: "vendors", label: "Vendors assigned" },
  { key: "quotation", label: "Quotation" },
  { key: "response", label: "Your response" },
  { key: "booking", label: "Booking" },
];

function getStepIndex(status: PremiumPlanningStatus): number {
  switch (status) {
    case PremiumPlanningStatus.SUBMITTED:
      return 1;
    case PremiumPlanningStatus.UNDER_REVIEW:
      return 2;
    case PremiumPlanningStatus.VENDORS_ASSIGNED:
      return 3;
    case PremiumPlanningStatus.QUOTED:
      return 4;
    case PremiumPlanningStatus.ACCEPTED:
    case PremiumPlanningStatus.REJECTED:
      return 5;
    case PremiumPlanningStatus.BOOKED:
      return 6;
    default:
      return 0;
  }
}

function getStatusColor(status: PremiumPlanningStatus) {
  switch (status) {
    case PremiumPlanningStatus.REJECTED:
      return { bg: "#FFE6EB", text: "#E63B5F" };
    case PremiumPlanningStatus.BOOKED:
      return { bg: "#DCFCE7", text: "#15803D" };
    default:
      return { bg: "#FFE6EB", text: "#FF4D6D" };
  }
}

function formatStatusLabel(status: PremiumPlanningStatus) {
  return status.replace(/_/g, " ");
}

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

// Quotation is stored as free-form JSON by PremiumPlanningService.quote():
// { amount, advancePercentage, advanceAmount, validityDays, validUntil,
//   inclusions, vendorBreakdown: [{ vendorId, vendorName, category, cost }] }
type QuotationVendorLine = {
  vendorId?: string;
  vendorName: string;
  category: string;
  cost: number;
};

type QuotationDetails = {
  advancePercentage?: number;
  advanceAmount?: number;
  inclusions?: string;
  vendorBreakdown?: QuotationVendorLine[];
};

export function PlanMyWeddingScreen() {
  const navigation = useNavigation<any>();

  const [requests, setRequests] = useState<PremiumPlanningRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notPremium, setNotPremium] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [payingAdvanceId, setPayingAdvanceId] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setError(null);
    setNotPremium(false);
    try {
      const data = await premiumPlanningApi.listMine();
      setRequests(data);
    } catch (err: any) {
      if (err?.response?.status === 403) {
        setNotPremium(true);
      } else {
        setError(
          err?.response?.data?.message || "Couldn't load your planning requests.",
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchRequests();
    }, [fetchRequests]),
  );

  const handleRespond = async (id: string, accept: boolean) => {
    setRespondingId(id);
    try {
      await premiumPlanningApi.respond(id, accept);
      await fetchRequests();
    } catch (err: any) {
      if (err?.response?.status === 403) {
        setNotPremium(true);
      } else {
        await fetchRequests();
      }
    } finally {
      setRespondingId(null);
    }
  };

  const handlePayAdvance = async (id: string) => {
    setPayingAdvanceId(id);
    try {
      await premiumPlanningApi.payAdvance(id);
      await fetchRequests();
    } catch (err: any) {
      if (err?.response?.status === 403) {
        setNotPremium(true);
      } else {
        setError(
          err?.response?.data?.message ||
            "Couldn't process the advance payment. Please try again.",
        );
      }
    } finally {
      setPayingAdvanceId(null);
    }
  };

  if (showForm) {
    return (
      <PlanMyWeddingForm
        onBack={() => setShowForm(false)}
        onCreated={() => {
          setShowForm(false);
          setLoading(true);
          fetchRequests();
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={20} color="#3F1D2F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plan My Wedding</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <MaterialIcons name="auto-awesome" size={16} color="#6C2D45" />
            <Text style={styles.heroBadgeText}>Premium concierge</Text>
          </View>
          <Text style={styles.heroTitle}>Your personal wedding planning team</Text>
          <Text style={styles.heroSubtitle}>
            Tell us your vision. Our team will review it, match approved vendors, and prepare a
            personalized quotation.
          </Text>
        </View>

        {notPremium ? (
          <View style={styles.upgradeCard}>
            <MaterialIcons name="workspace-premium" size={36} color="#FF4D6D" />
            <Text style={styles.upgradeTitle}>Premium membership required</Text>
            <Text style={styles.upgradeSubtext}>
              Plan My Wedding is a premium concierge feature. Upgrade your plan to submit
              preferences and get a personalized quotation from our team.
            </Text>
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={() => navigation.navigate("UpgradeMembership")}
            >
              <MaterialIcons name="arrow-upward" size={16} color="#FFFFFF" />
              <Text style={styles.upgradeButtonText}>Upgrade my plan</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity style={styles.newRequestButton} onPress={() => setShowForm(true)}>
              <MaterialIcons name="add-circle-outline" size={18} color="#FFFFFF" />
              <Text style={styles.newRequestButtonText}>Submit new planning request</Text>
            </TouchableOpacity>

            {loading && (
              <View style={styles.loadingCard}>
                <ActivityIndicator color="#FF4D6D" />
                <Text style={styles.loadingText}>Loading your requests...</Text>
              </View>
            )}

            {!loading && error && (
              <View style={styles.errorCard}>
                <MaterialIcons name="error-outline" size={28} color="#FF4D6D" />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={() => {
                    setLoading(true);
                    fetchRequests();
                  }}
                >
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              </View>
            )}

            {!loading && !error && requests.length === 0 && (
              <View style={styles.emptyState}>
                <MaterialIcons name="celebration" size={40} color="#FFB3BF" />
                <Text style={styles.emptyStateText}>No planning requests yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Submit your preferences and our team will start matching vendors for your big day.
                </Text>
              </View>
            )}

            {!loading &&
              !error &&
              requests.map((request) => {
                const stepIndex = getStepIndex(request.status);
                const statusColor = getStatusColor(request.status);
                const isResponding = respondingId === request.id;
                const isPayingAdvance = payingAdvanceId === request.id;

                const details = (request.quotationDetails ?? {}) as QuotationDetails;
                const vendorBreakdown = details.vendorBreakdown ?? [];
                const advancePercentage = details.advancePercentage ?? 50;
                const advanceAmount =
                  details.advanceAmount ??
                  (request.quotationAmount != null
                    ? Math.round((request.quotationAmount * advancePercentage) / 100)
                    : 0);

                // Quotation card stays visible through Accepted/Booked/Rejected too,
                // not just while status === QUOTED — so the customer keeps seeing
                // what they agreed to and how much is due.
                const showQuotationCard =
                  request.quotationAmount != null &&
                  [
                    PremiumPlanningStatus.QUOTED,
                    PremiumPlanningStatus.ACCEPTED,
                    PremiumPlanningStatus.REJECTED,
                    PremiumPlanningStatus.BOOKED,
                  ].includes(request.status);

                return (
                  <View key={request.id} style={styles.requestCard}>
                    <View style={styles.requestTopRow}>
                      <View>
                        <Text style={styles.requestDate}>
                          {new Date(request.createdAt).toLocaleDateString("en-GB")}
                        </Text>
                        <Text style={styles.requestTitle}>
                          {request.weddingType} · {request.city}
                        </Text>
                        <Text style={styles.requestMeta}>
                          {request.guestCount} guests · {request.theme}
                        </Text>
                      </View>
                      <View style={[styles.statusPill, { backgroundColor: statusColor.bg }]}>
                        <Text style={[styles.statusPillText, { color: statusColor.text }]}>
                          {formatStatusLabel(request.status)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.stepperRow}>
                      {STEPS.map((step, idx) => {
                        const done = idx + 1 <= stepIndex;
                        return (
                          <View
                            key={step.key}
                            style={[
                              styles.stepPill,
                              done ? styles.stepPillDone : styles.stepPillPending,
                            ]}
                          >
                            <MaterialIcons
                              name={done ? "check-circle" : "radio-button-unchecked"}
                              size={13}
                              color={done ? "#FF4D6D" : "#B98A96"}
                            />
                            <Text
                              style={done ? styles.stepPillTextDone : styles.stepPillTextPending}
                            >
                              {step.label}
                            </Text>
                          </View>
                        );
                      })}
                    </View>

                    {request.assignedVendors.length > 0 && (
                      <>
                        <View style={styles.sectionDivider} />
                        <Text style={[styles.fieldLabel, { marginTop: 0 }]}>
                          Vendors assigned by our team
                        </Text>
                        {request.assignedVendors.map((vendor) => (
                          <View key={vendor.id} style={styles.vendorCard}>
                            <Text style={styles.vendorCardTitle}>{vendor.businessName}</Text>
                            <Text style={styles.vendorCardSubtitle}>
                              {vendor.category}
                              {vendor.category && vendor.city ? " · " : ""}
                              {vendor.city}
                            </Text>
                            <TouchableOpacity
                              style={styles.vendorViewButton}
                              onPress={() =>
                                navigation.navigate("CoupleTabs", {
                                  screen: "Vendors",
                                  params: {
                                    screen: "VendorDetails",
                                    params: { vendorId: vendor.profileId },
                                  },
                                })
                              }
                            >
                              <MaterialIcons name="visibility" size={14} color="#FF4D6D" />
                              <Text style={styles.vendorViewButtonText}>View Profile & Work</Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </>
                    )}

                    {showQuotationCard && (
                      <>
                        <View style={styles.sectionDivider} />
                        <View style={styles.quotationCard}>
                          <View style={styles.quotationHeaderRow}>
                            <MaterialIcons name="receipt-long" size={16} color="#FF4D6D" />
                            <Text style={styles.quotationHeaderText}>
                              Official Wedding Quotation
                            </Text>
                          </View>

                          <View style={styles.quotationTotalRow}>
                            <Text style={styles.quotationTotalLabel}>Total amount</Text>
                            <Text style={styles.quotationTotalValue}>
                              {formatCurrency(request.quotationAmount!)}
                            </Text>
                          </View>

                          {request.status === PremiumPlanningStatus.QUOTED && (
                            <View style={styles.advanceDueBox}>
                              <Text style={styles.advanceDueLabel}>
                                Advance Due to Confirm ({advancePercentage}%)
                              </Text>
                              <Text style={styles.advanceDueValue}>
                                {formatCurrency(advanceAmount)}
                              </Text>
                            </View>
                          )}

                          {vendorBreakdown.length > 0 && (
                            <>
                              <View style={styles.quotationBreakdownDivider} />
                              <Text style={styles.quotationSectionLabel}>
                                Itemized Cost Breakdown
                              </Text>
                              {vendorBreakdown.map((line, idx) => (
                                <View
                                  key={line.vendorId ?? `${line.vendorName}-${idx}`}
                                  style={styles.quotationLineRow}
                                >
                                  <View>
                                    <Text style={styles.quotationLineLabel}>
                                      {line.vendorName}
                                    </Text>
                                    <Text style={styles.quotationLineSubLabel}>
                                      {line.category}
                                    </Text>
                                  </View>
                                  <Text style={styles.quotationLineValue}>
                                    {formatCurrency(line.cost)}
                                  </Text>
                                </View>
                              ))}
                            </>
                          )}

                          {details.inclusions ? (
                            <View style={styles.quotationNotesBox}>
                              <Text style={styles.quotationNotesLabel}>
                                Included Package Services & Terms
                              </Text>
                              <Text style={styles.quotationNotesText}>
                                {details.inclusions}
                              </Text>
                            </View>
                          ) : null}

                          {request.adminNotes && (
                            <View style={styles.quotationNotesBox}>
                              <Text style={styles.quotationNotesLabel}>
                                Note from our team
                              </Text>
                              <Text style={styles.quotationNotesText}>
                                {request.adminNotes}
                              </Text>
                            </View>
                          )}
                        </View>

                        {request.status === PremiumPlanningStatus.QUOTED && (
                          <View style={styles.responseRow}>
                            <TouchableOpacity
                              style={styles.rejectButton}
                              disabled={isResponding}
                              onPress={() => handleRespond(request.id, false)}
                            >
                              <Text style={styles.rejectButtonText}>Decline</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.acceptButton}
                              disabled={isResponding}
                              onPress={() => handleRespond(request.id, true)}
                            >
                              {isResponding ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                              ) : (
                                <Text style={styles.acceptButtonText}>Accept quotation</Text>
                              )}
                            </TouchableOpacity>
                          </View>
                        )}

                        {request.status === PremiumPlanningStatus.ACCEPTED && (
                          <TouchableOpacity
                            style={styles.payAdvanceButton}
                            disabled={isPayingAdvance}
                            onPress={() => handlePayAdvance(request.id)}
                          >
                            {isPayingAdvance ? (
                              <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                              <>
                                <MaterialIcons
                                  name="account-balance-wallet"
                                  size={16}
                                  color="#FFFFFF"
                                />
                                <Text style={styles.payAdvanceButtonText}>
                                  Pay Advance {formatCurrency(advanceAmount)} to Confirm
                                </Text>
                              </>
                            )}
                          </TouchableOpacity>
                        )}

                        {request.status === PremiumPlanningStatus.BOOKED && (
                          <View style={styles.bookedConfirmationCard}>
                            <View style={styles.bookedConfirmationHeaderRow}>
                              <MaterialIcons name="check-circle" size={18} color="#15803D" />
                              <Text style={styles.bookedConfirmationTitle}>
                                Booking Fully Confirmed!
                              </Text>
                            </View>
                            <Text style={styles.bookedConfirmationSubtext}>
                              Your advance payment has been received and individual vendor
                              bookings are active.
                            </Text>
                            <TouchableOpacity
                              style={styles.goToBookingsButton}
                              onPress={() =>
                                navigation.navigate("CoupleTabs", { screen: "Bookings" })
                              }
                            >
                              <Text style={styles.goToBookingsButtonText}>
                                View Your Bookings Dashboard →
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </>
                    )}
                  </View>
                );
              })}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}