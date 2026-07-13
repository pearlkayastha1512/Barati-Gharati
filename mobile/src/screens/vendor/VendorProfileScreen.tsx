import React,{useEffect,useState} from "react";
import {ScrollView,View,Text,TouchableOpacity,ActivityIndicator,Image} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {LinearGradient} from "expo-linear-gradient";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {useNavigation,useFocusEffect} from "@react-navigation/native";
import {getMyVendorProfile} from "../../api/vendor.api";
import {COLORS} from "../../constants/theme";
import {styles} from "./vendorProfileStyles";


export default function VendorProfileScreen(){

const navigation=useNavigation<any>();
const [profile,setProfile]=useState<any>(null);
const [loading,setLoading]=useState(true);

const loadProfile=async()=>{
try{
const res=await getMyVendorProfile();
console.log(res);
setProfile(res.data);
}catch(err){
console.log(err);
}finally{
setLoading(false);
}
};

useEffect(()=>{
loadProfile();
},[]);

useFocusEffect(
React.useCallback(()=>{
loadProfile();
},[])
);


if(loading){
return(
<SafeAreaView style={styles.center}>
<ActivityIndicator size="large" color={COLORS.primary}/>
</SafeAreaView>
);
}

const badgeKey=(profile?.badge || "BRONZE").toLowerCase();

return(
<SafeAreaView style={styles.safeArea}>
<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>

<View style={styles.heroWrapper}>

{/* Cover */}
<View style={styles.coverContainer}>
{profile?.coverImage?
<Image source={{uri:profile.coverImage}} style={styles.coverImage} resizeMode="cover"/>
:
<LinearGradient colors={[COLORS.gradientStart,COLORS.gradientEnd]} style={styles.coverImage}/>
}
<LinearGradient colors={["transparent","rgba(0,0,0,0.35)"]} style={styles.coverOverlay}/>

<View style={styles.topRow}>
<MaterialCommunityIcons name="store-outline" size={22} color="#fff"/>
<Text style={styles.tag}>Vendor Profile</Text>
</View>
</View>

{/* Avatar overlapping cover */}
<View style={styles.logoContainer}>
{profile?.logoUrl?
<Image source={{uri:profile.logoUrl}} style={styles.logo}/>
:
<View style={styles.logoPlaceholder}>
<MaterialCommunityIcons name="store" size={36} color={COLORS.primary}/>
</View>}
</View>

{/* Info card below cover */}
<View style={styles.heroContent}>

<Text style={styles.businessName}>{profile?.businessName}</Text>

{profile?.description?
<Text style={styles.description}>{profile.description}</Text>
:null}

<View style={styles.tags}>
{(profile?.city || profile?.address)?
<Text style={styles.badge}>📍 {profile?.city || profile?.address}</Text>
:null}

{profile?.category?.name?
<Text style={styles.badge}>{profile.category.name}</Text>
:null}

<Text style={[styles.badge, (styles as any)[`badge_${badgeKey}`]]}>
{profile?.badge || "BRONZE"}
</Text>
</View>

<View style={styles.statsRow}>
<View style={styles.statBox}>
<Text style={styles.statValue}>
{profile?.currentMonthBookings ?? 0}/{profile?.monthlyBookingLimit ?? "-"}
</Text>
<Text style={styles.statLabel}>Bookings this month</Text>
</View>

<View style={styles.statusPill}>
<View style={styles.statusDot}/>
<Text style={styles.statusText}>{profile?.status || "PENDING"}</Text>
</View>
</View>

</View>
</View>

<View style={styles.card}>
<View style={{flex:1}}>
<Text style={styles.title}>{profile?.businessName}</Text>
<Text style={styles.sub}>{profile?.category?.name}</Text>
</View>

<TouchableOpacity style={styles.editBtn} onPress={()=>navigation.navigate("VendorEditProfile",{profile})}>
<Text style={styles.editText}>Edit Profile</Text>
</TouchableOpacity>
</View>

<View style={styles.card}>
<Text style={styles.heading}>Owner Information</Text>
<Info title="Owner Name" value={profile?.user?.name}/>
<Info title="Email" value={profile?.user?.email}/>
<Info title="Phone" value={profile?.user?.phone}/>
</View>

<View style={styles.card}>
<Text style={styles.heading}>Business Details</Text>
<Info title="Business Name" value={profile?.businessName}/>
<Info title="Category" value={profile?.category?.name}/>
<Info title="City" value={profile?.city}/>
<Info title="Address" value={profile?.address}/>
<Info title="Experience" value={profile?.experience}/>
<Info title="GST Number" value={profile?.gstNumber}/>
</View>

<View style={styles.card}>
<Text style={styles.heading}>Business Description</Text>
<Text style={styles.desc}>{profile?.description || "No description available."}</Text>
</View>

<View style={styles.card}>
<Text style={styles.heading}>Social Links</Text>
<Info title="Website" value={profile?.website}/>
<Info title="Instagram" value={profile?.instagram}/>
<Info title="Facebook" value={profile?.facebook}/>
<Info title="Youtube" value={profile?.youtube}/>
<Info title="LinkedIn" value={profile?.linkedin}/>
</View>

<View style={styles.card}>
<Text style={styles.heading}>Vendor Badge</Text>
<Info title="Badge" value={profile?.badge}/>
<Info title="Monthly Booking Limit" value={String(profile?.monthlyBookingLimit)}/>
<Info title="Current Month Bookings" value={String(profile?.currentMonthBookings)}/>
</View>

<View style={styles.card}>
<Text style={styles.heading}>Verification</Text>
<Info title="Status" value={profile?.status}/>
<Info title="Business Verified" value={profile?.businessVerified?"Yes":"No"}/>
<Info title="GST Verified" value={profile?.gstVerified?"Yes":"No"}/>
<Info title="Bank Verified" value={profile?.bankVerified?"Yes":"No"}/>
<Info title="Documents Uploaded" value={profile?.documentsUploaded?"Yes":"No"}/>
</View>

</ScrollView>
</SafeAreaView>
);

}

function Info({title,value}:any){
return(
<View style={styles.infoRow}>
<Text style={styles.infoTitle}>{title}</Text>
<Text style={styles.infoValue}>{value || "—"}</Text>
</View>
);
}