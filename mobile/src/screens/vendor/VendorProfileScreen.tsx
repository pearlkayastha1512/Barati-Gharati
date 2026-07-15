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

const hasSocialLinks = !!(profile?.website || profile?.instagram || profile?.facebook || profile?.youtube || profile?.linkedin);

return(
<SafeAreaView style={styles.safeArea}>
<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>

<View style={styles.heroWrapper}>

{/* Cover — pink-to-orange gradient tint, matching the dashboard hero card */}
<View style={styles.coverContainer}>
{profile?.coverImage?
<Image source={{uri:profile.coverImage}} style={styles.coverImage} resizeMode="cover"/>
:
null
}
<LinearGradient
colors={profile?.coverImage?
["rgba(228,0,90,0.93)","rgba(255,159,26,0.93)"]
:
[COLORS.gradientStart,COLORS.gradientEnd]
}
start={{x:0,y:0}} end={{x:1,y:1}}
style={styles.coverOverlay}
/>

<View style={styles.topRow}>
<MaterialCommunityIcons name="store-outline" size={14} color="#fff"/>
<Text style={styles.tag}>Vendor Profile</Text>
</View>
</View>

{/* Avatar overlapping cover */}
<View style={styles.logoContainer}>
{profile?.logoUrl?
<Image source={{uri:profile.logoUrl}} style={styles.logo}/>
:
<View style={styles.logoPlaceholder}>
<MaterialCommunityIcons name="store" size={30} color={COLORS.primary}/>
</View>}
</View>

{/* Info card below cover */}
<View style={styles.heroContent}>

<Text style={styles.businessName}>{profile?.businessName}</Text>

{profile?.description?
<Text style={styles.description} numberOfLines={2}>{profile.description}</Text>
:null}

<View style={styles.tags}>
{(profile?.city || profile?.address)?
<Text style={styles.badge}>📍 {profile?.city || profile?.address}</Text>
:null}

{profile?.category?.name?
<Text style={styles.badge}>{profile.category.name}</Text>
:null}

<Text style={[styles.badge, (styles as any)[`badge_${badgeKey}`]]}>
{(profile?.badge || "BRONZE").toUpperCase()} TIER
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
<Text style={styles.statusText}>{(profile?.status || "PENDING").toUpperCase()}</Text>
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
<MaterialCommunityIcons name="pencil-outline" size={14} color="#fff"/>
<Text style={styles.editText}>Edit Profile</Text>
</TouchableOpacity>
</View>

<SectionCard icon="account-outline" title="Owner Information">
<Info title="Owner Name" value={profile?.user?.name}/>
<Info title="Email" value={profile?.user?.email}/>
<Info title="Phone" value={profile?.user?.phone} last/>
</SectionCard>

<SectionCard icon="briefcase-outline" title="Business Details">
<Info title="Business Name" value={profile?.businessName}/>
<Info title="Category" value={profile?.category?.name}/>
<Info title="City" value={profile?.city}/>
<Info title="Address" value={profile?.address}/>
<Info title="Experience" value={profile?.experience}/>
<Info title="GST Number" value={profile?.gstNumber} last/>
</SectionCard>

<SectionCard icon="text-box-outline" title="Business Description">
<Text style={styles.desc}>{profile?.description || "No description available."}</Text>
</SectionCard>

{hasSocialLinks?
<SectionCard icon="link-variant" title="Social Links">
<Info title="Website" value={profile?.website}/>
<Info title="Instagram" value={profile?.instagram}/>
<Info title="Facebook" value={profile?.facebook}/>
<Info title="Youtube" value={profile?.youtube}/>
<Info title="LinkedIn" value={profile?.linkedin} last/>
</SectionCard>
:null}

<SectionCard icon="medal-outline" title="Vendor Badge">
<Info title="Badge" value={profile?.badge}/>
<Info title="Monthly Booking Limit" value={String(profile?.monthlyBookingLimit ?? "—")}/>
<Info title="Current Month Bookings" value={String(profile?.currentMonthBookings ?? 0)} last/>
</SectionCard>

<SectionCard icon="shield-check-outline" title="Verification">
<View style={styles.verifyGrid}>
<VerifyItem label="Business" active={!!profile?.businessVerified}/>
<VerifyItem label="GST" active={!!profile?.gstVerified}/>
<VerifyItem label="Bank" active={!!profile?.bankVerified}/>
<VerifyItem label="Documents" active={!!profile?.documentsUploaded}/>
</View>
</SectionCard>

<View style={styles.footerSpacing}/>

</ScrollView>
</SafeAreaView>
);

}

function SectionCard({icon,title,children}:{icon:any,title:string,children:React.ReactNode}){
return(
<View style={styles.card}>
<View style={styles.sectionHeaderRow}>
<View style={styles.sectionTitleWrap}>
<View style={styles.sectionIconWrap}>
<MaterialCommunityIcons name={icon} size={16} color={COLORS.primary}/>
</View>
<Text style={styles.heading}>{title}</Text>
</View>
</View>
{children}
</View>
);
}

function Info({title,value,last}:{title:string,value?:any,last?:boolean}){
return(
<View style={[styles.infoRow, last?styles.infoRowLast:null]}>
<Text style={styles.infoTitle}>{title}</Text>
<Text style={styles.infoValue}>{value || "—"}</Text>
</View>
);
}

function VerifyItem({label,active}:{label:string,active:boolean}){
return(
<View style={styles.verifyItem}>
<View style={[styles.verifyCard, active?styles.verifyCardOn:styles.verifyCardOff]}>
<View style={[styles.verifyIconWrap,{backgroundColor: active? "#DFF5E6" : "#EFEFEF"}]}>
<MaterialCommunityIcons
name={active?"check-circle":"close-circle-outline"}
size={16}
color={active?COLORS.success:COLORS.textLight}
/>
</View>
<Text style={styles.verifyLabel}>{label}</Text>
</View>
</View>
);
}