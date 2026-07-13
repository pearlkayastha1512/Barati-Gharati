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
 paddingHorizontal:16,
 paddingBottom:30
},

// ===== Hero / cover section =====

heroWrapper:{
marginBottom:18
},

coverContainer:{
height:150,
borderTopLeftRadius:20,
borderTopRightRadius:20,
overflow:"hidden",
backgroundColor:COLORS.gradientStart
},

coverImage:{
width:"100%",
height:"100%"
},

coverOverlay:{
position:"absolute",
left:0,
right:0,
bottom:0,
height:60
},

topRow:{
position:"absolute",
top:14,
left:16,
flexDirection:"row",
alignItems:"center"
},

tag:{
marginLeft:8,
color:"#fff",
fontWeight:"700",
fontSize:14
},

logoContainer:{
alignItems:"center",
marginTop:-40
},

logo:{
width:80,
height:80,
borderRadius:40,
borderWidth:4,
borderColor:"#fff"
},

logoPlaceholder:{
width:80,
height:80,
borderRadius:40,
backgroundColor:"#fff",
borderWidth:4,
borderColor:"#fff",
justifyContent:"center",
alignItems:"center",
shadowColor:"#000",
shadowOpacity:0.1,
shadowRadius:6,
shadowOffset:{
 width:0,
 height:2
},
elevation:3
},

heroContent:{
backgroundColor:"#fff",
borderBottomLeftRadius:20,
borderBottomRightRadius:20,
paddingHorizontal:20,
paddingTop:10,
paddingBottom:20,
alignItems:"center",
shadowColor:"#000",
shadowOpacity:0.05,
shadowRadius:8,
shadowOffset:{
 width:0,
 height:4
},
elevation:2
},

businessName:{
fontSize:21,
fontWeight:"800",
color:"#1a1a1a",
marginTop:6,
textAlign:"center"
},

description:{
marginTop:6,
color:"#666",
fontSize:13,
lineHeight:18,
textAlign:"center"
},

tags:{
flexDirection:"row",
flexWrap:"wrap",
justifyContent:"center",
marginTop:14
},

badge:{
backgroundColor:"#F1F3F5",
color:"#444",
paddingHorizontal:12,
paddingVertical:6,
borderRadius:15,
marginRight:6,
marginBottom:6,
fontSize:12,
fontWeight:"700",
overflow:"hidden"
},

badge_bronze:{
backgroundColor:"#F3E1D3",
color:"#8B5A2B"
},

badge_silver:{
backgroundColor:"#E8E9EB",
color:"#5C6066"
},

badge_gold:{
backgroundColor:"#FBEEC1",
color:"#8A6D1D"
},

statsRow:{
flexDirection:"row",
alignItems:"center",
justifyContent:"space-between",
width:"100%",
marginTop:18,
paddingTop:16,
borderTopWidth:0.5,
borderTopColor:"#eee"
},

statBox:{
alignItems:"flex-start"
},

statValue:{
fontSize:20,
fontWeight:"800",
color:"#1a1a1a"
},

statLabel:{
fontSize:12,
color:"#888",
marginTop:2
},

statusPill:{
flexDirection:"row",
alignItems:"center",
backgroundColor:"#DCFCE7",
paddingHorizontal:12,
paddingVertical:7,
borderRadius:20
},

statusDot:{
width:7,
height:7,
borderRadius:4,
backgroundColor:"#15803D",
marginRight:6
},

statusText:{
color:"#15803D",
fontWeight:"700",
fontSize:12
},

// ===== Cards =====

card:{
backgroundColor:"#fff",
borderRadius:16,
padding:15,
marginBottom:12,

shadowColor:"#000",
shadowOpacity:0.06,
shadowRadius:6,
shadowOffset:{
 width:0,
 height:3
},

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
fontSize:16,
fontWeight:"800",
marginBottom:10,
color:"#222"
},

infoRow:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
paddingVertical:8,
borderBottomWidth:0.5,
borderBottomColor:"#eee"
},

infoTitle:{
fontSize:13,
color:"#888",
fontWeight:"600"
},

infoValue:{
fontSize:14,
fontWeight:"700",
color:"#222",
textAlign:"right",
flex:1,
marginLeft:15
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

sectionHeader:{
flexDirection:"row",
alignItems:"center",
marginBottom:10,
gap:8
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
overflow:"hidden"
},

previewImage:{
width:"100%",
height:"100%"
},

coverPicker:{
height:180,
borderRadius:15,
borderWidth:1,
borderColor:"#ddd",
justifyContent:"center",
alignItems:"center",
marginBottom:20,
overflow:"hidden"
},

coverPreview:{
width:"100%",
height:"100%"
},

buttonText:{
color:"#fff",
fontWeight:"700",
fontSize:16
}

});