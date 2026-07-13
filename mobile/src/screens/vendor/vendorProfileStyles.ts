import {StyleSheet} from "react-native";
import {COLORS} from "../../constants/theme";

export const styles=StyleSheet.create({

safeArea:{
flex:1,
backgroundColor:COLORS.background
},

center:{
flex:1,
justifyContent:"center",
alignItems:"center"
},

container:{
padding:20,
paddingBottom:40
},

hero:{
borderRadius:24,
padding:22,
marginBottom:18
},

topRow:{
flexDirection:"row",
alignItems:"center"
},

tag:{
marginLeft:10,
color:"#fff",
fontWeight:"700",
fontSize:15
},

businessName:{
fontSize:28,
fontWeight:"800",
color:"#fff",
marginTop:16
},

description:{
marginTop:10,
color:"#fff",
fontSize:15,
lineHeight:22
},

tags:{
flexDirection:"row",
flexWrap:"wrap",
marginTop:16
},

badge:{
backgroundColor:"rgba(255,255,255,0.25)",
color:"#fff",
paddingHorizontal:12,
paddingVertical:6,
borderRadius:20,
marginRight:8,
marginBottom:8,
overflow:"hidden",
fontWeight:"600"
},

ratingBox:{
marginTop:18
},

rating:{
fontSize:22,
fontWeight:"800",
color:"#fff"
},

ratingText:{
color:"#fff",
marginTop:4
},

card:{
backgroundColor:"#fff",
borderRadius:18,
padding:18,
marginBottom:16,
shadowColor:"#000",
shadowOpacity:0.05,
shadowRadius:8,
elevation:2
},

title:{
fontSize:20,
fontWeight:"700",
color:"#222"
},

sub:{
fontSize:15,
color:"#777",
marginTop:4
},

editBtn:{
backgroundColor:COLORS.primary,
paddingHorizontal:18,
paddingVertical:10,
borderRadius:12
},

editText:{
color:"#fff",
fontWeight:"700"
},

heading:{
fontSize:18,
fontWeight:"700",
marginBottom:15,
color:"#222"
},

infoRow:{
flexDirection:"row",
justifyContent:"space-between",
marginBottom:14
},

infoTitle:{
fontSize:15,
color:"#777"
},

infoValue:{
fontSize:15,
fontWeight:"600",
color:"#222",
textAlign:"right",
flex:1,
marginLeft:20
},

desc:{
fontSize:15,
lineHeight:24,
color:"#555"
},

verify:{
backgroundColor:"#DCFCE7",
padding:15,
borderRadius:12
},

verifyText:{
color:"#15803D",
fontWeight:"700"
},

input:{
backgroundColor:"#fff",
borderWidth:1,
borderColor:"#E5E7EB",
borderRadius:12,
paddingHorizontal:15,
paddingVertical:14,
fontSize:15,
marginBottom:15,
color:"#111"
},

button:{
backgroundColor:COLORS.primary,
paddingVertical:15,
borderRadius:12,
alignItems:"center",
marginTop:15,
marginBottom:30
},
coverImage:{
width:"100%",
height:170,
borderRadius:20,
marginBottom:16
},

logoContainer:{
alignItems:"center",
marginBottom:16
},

logo:{
width:90,
height:90,
borderRadius:45,
borderWidth:3,
borderColor:"#fff"
},

logoPlaceholder:{
width:90,
height:90,
borderRadius:45,
backgroundColor:"rgba(255,255,255,0.25)",
justifyContent:"center",
alignItems:"center"
},
imagePicker:{
height:130,
width:130,
borderRadius:65,
borderWidth:1,
borderColor:"#ddd",
justifyContent:"center",
alignItems:"center",
alignSelf:"center",
marginBottom:20,
overflow:"hidden",
},

previewImage:{
width:"100%",
height:"100%",
},

coverPicker:{
height:180,
borderRadius:15,
borderWidth:1,
borderColor:"#ddd",
justifyContent:"center",
alignItems:"center",
marginBottom:20,
overflow:"hidden",
},

coverPreview:{
width:"100%",
height:"100%",
},

buttonText:{
color:"#fff",
fontWeight:"700",
fontSize:16
}

});