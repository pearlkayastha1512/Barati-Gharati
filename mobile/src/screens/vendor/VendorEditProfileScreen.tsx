import React,{useState} from "react";
import {
ScrollView,
Text,
TextInput,
TouchableOpacity,
Alert,
Image,
ActivityIndicator
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
updateVendorProfile,
uploadVendorLogo,
uploadVendorCover
} from "../../api/vendor.api";
import {SafeAreaView} from "react-native-safe-area-context";
import {styles} from "./vendorProfileStyles";
import {COLORS} from "../../constants/theme";

export default function VendorEditProfileScreen({route,navigation}:any){

const profile=route.params.profile;

const [ownerName,setOwnerName]=useState(profile?.user?.name||"");
const [email,setEmail]=useState(profile?.user?.email||"");
const [phone,setPhone]=useState(profile?.user?.phone||"");
const [businessName,setBusinessName]=useState(profile?.businessName||"");
const [description,setDescription]=useState(profile?.description||"");
const [city,setCity]=useState(profile?.city||"");
const [address,setAddress]=useState(profile?.address||"");
const [experience,setExperience]=useState(profile?.experience||"");
const [gstNumber,setGstNumber]=useState(profile?.gstNumber||"");
const [website,setWebsite]=useState(profile?.website||"");
const [instagram,setInstagram]=useState(profile?.instagram||"");
const [facebook,setFacebook]=useState(profile?.facebook||"");
const [youtube,setYoutube]=useState(profile?.youtube||"");
const [linkedin,setLinkedin]=useState(profile?.linkedin||"");
const [logo,setLogo]=useState(profile?.logoUrl||"");
const [cover,setCover]=useState(profile?.coverImage||"");
const [saving,setSaving]=useState(false);

const pickLogo=async()=>{

const permission=
await ImagePicker.requestMediaLibraryPermissionsAsync();

if(!permission.granted){
Alert.alert(
"Permission Required",
"Please allow gallery access."
);
return;
}

const result=
await ImagePicker.launchImageLibraryAsync({
mediaTypes:ImagePicker.MediaTypeOptions.Images,
allowsEditing:true,
quality:0.8
});

if(!result.canceled){
setLogo(result.assets[0].uri);
}

};

const pickCover=async()=>{

const permission=
await ImagePicker.requestMediaLibraryPermissionsAsync();

if(!permission.granted){
Alert.alert(
"Permission Required",
"Please allow gallery access."
);
return;
}

const result=
await ImagePicker.launchImageLibraryAsync({
mediaTypes:ImagePicker.MediaTypeOptions.Images,
allowsEditing:true,
quality:0.8
});

if(!result.canceled){
setCover(result.assets[0].uri);
}

};

const saveProfile=async()=>{

try{

setSaving(true);

await updateVendorProfile({
ownerName,
email,
phone,
businessName,
description,
city,
address,
experience,
gstNumber,
website,
instagram,
facebook,
youtube,
linkedin
});

if(
logo &&
logo!==profile?.logoUrl
){
await uploadVendorLogo(logo);
}

if(
cover &&
cover!==profile?.coverImage
){
await uploadVendorCover(cover);
}

Alert.alert(
"Success",
"Profile updated successfully"
);

navigation.goBack();

}catch(error){

console.log(error);

Alert.alert(
"Error",
"Unable to update profile"
);

}finally{

setSaving(false);

}

};
return(

<SafeAreaView style={{flex:1}}>

<ScrollView
contentContainerStyle={{padding:20}}
showsVerticalScrollIndicator={false}
>

<Text style={{
fontSize:24,
fontWeight:"700",
marginBottom:20
}}>
Edit Profile
</Text>

<Text style={styles.heading}>
Business Logo
</Text>

<TouchableOpacity
style={styles.imagePicker}
onPress={pickLogo}
>

{logo?

<Image
source={{uri:logo}}
style={styles.previewImage}
/>

:

<Text>Select Logo</Text>

}

</TouchableOpacity>

<Text style={styles.heading}>
Cover Image
</Text>

<TouchableOpacity
style={styles.coverPicker}
onPress={pickCover}
>

{cover?

<Image
source={{uri:cover}}
style={styles.coverPreview}
/>

:

<Text>Select Cover Image</Text>

}

</TouchableOpacity>

<TextInput
style={styles.input}
placeholder="Owner Name"
value={ownerName}
onChangeText={setOwnerName}
/>

<TextInput
style={styles.input}
placeholder="Email"
keyboardType="email-address"
value={email}
onChangeText={setEmail}
/>

<TextInput
style={styles.input}
placeholder="Phone"
keyboardType="phone-pad"
value={phone}
onChangeText={setPhone}
/>

<TextInput
style={styles.input}
placeholder="Business Name"
value={businessName}
onChangeText={setBusinessName}
/>

<TextInput
style={styles.input}
placeholder="Description"
value={description}
multiline
onChangeText={setDescription}
/>

<TextInput
style={styles.input}
placeholder="City"
value={city}
onChangeText={setCity}
/>

<TextInput
style={styles.input}
placeholder="Address"
value={address}
multiline
onChangeText={setAddress}
/>

<TextInput
style={styles.input}
placeholder="Experience"
value={experience}
onChangeText={setExperience}
/>

<TextInput
style={styles.input}
placeholder="GST Number"
value={gstNumber}
onChangeText={setGstNumber}
/>

<TextInput
style={styles.input}
placeholder="Website"
value={website}
autoCapitalize="none"
onChangeText={setWebsite}
/>

<TextInput
style={styles.input}
placeholder="Instagram"
value={instagram}
autoCapitalize="none"
onChangeText={setInstagram}
/>

<TextInput
style={styles.input}
placeholder="Facebook"
value={facebook}
autoCapitalize="none"
onChangeText={setFacebook}
/>

<TextInput
style={styles.input}
placeholder="Youtube"
value={youtube}
autoCapitalize="none"
onChangeText={setYoutube}
/>

<TextInput
style={styles.input}
placeholder="LinkedIn"
value={linkedin}
autoCapitalize="none"
onChangeText={setLinkedin}
/>

<TouchableOpacity
disabled={saving}
style={{
backgroundColor:COLORS.primary,
padding:15,
borderRadius:12,
marginTop:20,
marginBottom:30,
opacity:saving?0.6:1
}}
onPress={saveProfile}
>

{saving?

<ActivityIndicator
color="#fff"
/>

:

<Text style={{
color:"#fff",
fontWeight:"700",
textAlign:"center"
}}>
Save Changes
</Text>

}

</TouchableOpacity>

</ScrollView>

</SafeAreaView>

);

}