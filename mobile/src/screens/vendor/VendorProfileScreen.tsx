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

return(
<SafeAreaView style={styles.safeArea}>
<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>

<LinearGradient colors={[COLORS.gradientStart,COLORS.gradientEnd]} style={styles.hero}>

{profile?.coverImage?
<Image source={{uri:profile.coverImage}} style={styles.coverImage}/>
:null}

<View style={styles.topRow}>
<MaterialCommunityIcons name="store-outline" size={28} color="#fff"/>
<Text style={styles.tag}>Vendor Profile</Text>
</View>

<View style={styles.logoContainer}>
{profile?.logoUrl?
<Image source={{uri:profile.logoUrl}} style={styles.logo}/>
:
<View style={styles.logoPlaceholder}>
<MaterialCommunityIcons name="store" size={40} color="#fff"/>
</View>}
</View>

<Text style={styles.businessName}>{profile?.businessName}</Text>

<Text style={styles.description}>
{profile?.description || "No business description"}
</Text>

<View style={styles.tags}>
<Text style={styles.badge}>📍 {profile?.city || profile?.address || "-"}</Text>
<Text style={styles.badge}>{profile?.category?.name || "-"}</Text>
<Text style={styles.badge}>{profile?.badge || "BRONZE"}</Text>
</View>

<View style={styles.ratingBox}>
<Text style={styles.rating}>Bookings {profile?.currentMonthBookings}/{profile?.monthlyBookingLimit}</Text>
<Text style={styles.ratingText}>{profile?.status}</Text>
</View>

</LinearGradient>

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