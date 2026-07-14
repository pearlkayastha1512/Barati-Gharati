import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/theme";

export const styles = StyleSheet.create({

safeArea:{
flex:1,
backgroundColor:COLORS.background,
},

center:{
flex:1,
justifyContent:"center",
alignItems:"center",
},

container:{
paddingHorizontal:16,
paddingBottom:35,
},

// ================= HERO =================

heroWrapper:{
marginBottom:16,
},

coverContainer:{
height:132,
borderTopLeftRadius:24,
borderTopRightRadius:24,
overflow:"hidden",
backgroundColor:COLORS.gradientStart,
},

coverImage:{
width:"100%",
height:"100%",
},

coverOverlay:{
position:"absolute",
left:0,
right:0,
top:0,
bottom:0,
},

topRow:{
position:"absolute",
top:14,
left:14,
flexDirection:"row",
alignItems:"center",
backgroundColor:"rgba(255,255,255,0.22)",
paddingHorizontal:10,
paddingVertical:5,
borderRadius:8,
},

tag:{
marginLeft:6,
color:"#fff",
fontWeight:"700",
fontSize:11,
letterSpacing:.4,
textTransform:"uppercase",
},

logoContainer:{
alignItems:"center",
marginTop:-40,
zIndex:20,
},

logo:{
width:84,
height:84,
borderRadius:14,
borderWidth:3,
borderColor:"#fff",
backgroundColor:"#fff",
shadowColor:"#000",
shadowOpacity:.10,
shadowRadius:6,
shadowOffset:{
width:0,
height:3,
},
elevation:3,
},

logoPlaceholder:{
width:84,
height:84,
borderRadius:14,
backgroundColor:"#fff",
justifyContent:"center",
alignItems:"center",
borderWidth:3,
borderColor:"#fff",
shadowColor:"#000",
shadowOpacity:.10,
shadowRadius:6,
shadowOffset:{
width:0,
height:3,
},
elevation:3,
},

heroContent:{
backgroundColor:"#fff",
borderBottomLeftRadius:24,
borderBottomRightRadius:24,
paddingHorizontal:20,
paddingTop:10,
paddingBottom:20,
alignItems:"center",
borderWidth:1,
borderColor:COLORS.border,
borderTopWidth:0,
},

businessName:{
fontSize:20,
fontWeight:"800",
color:COLORS.textHeading,
marginTop:4,
textAlign:"center",
letterSpacing:-.2,
},

description:{
marginTop:6,
fontSize:13,
color:COLORS.textMuted,
lineHeight:19,
textAlign:"center",
paddingHorizontal:8,
},

tags:{
flexDirection:"row",
flexWrap:"wrap",
justifyContent:"center",
marginTop:12,
},

badge:{
paddingHorizontal:11,
paddingVertical:5,
borderRadius:7,
marginHorizontal:3,
marginBottom:6,
fontSize:11,
fontWeight:"700",
overflow:"hidden",
borderWidth:1,
letterSpacing:.2,
},

badge_bronze:{
backgroundColor:"#F8EFE7",
borderColor:"#E3C9AC",
color:"#8A5A34",
},

badge_silver:{
backgroundColor:"#F3F4F6",
borderColor:"#DCE0E5",
color:"#5F6670",
},

badge_gold:{
backgroundColor:"#FBF3D9",
borderColor:"#E9CE7C",
color:"#946600",
},

statsRow:{
width:"100%",
flexDirection:"row",
alignItems:"center",
justifyContent:"space-between",
marginTop:16,
paddingTop:14,
borderTopWidth:1,
borderTopColor:COLORS.border,
},

statBox:{
flex:1,
},

statValue:{
fontSize:16,
fontWeight:"800",
color:COLORS.textHeading,
},

statLabel:{
marginTop:2,
fontSize:11,
color:COLORS.textMuted,
},

statusPill:{
backgroundColor:COLORS.successLight,
paddingHorizontal:12,
paddingVertical:7,
borderRadius:8,
flexDirection:"row",
alignItems:"center",
},

statusDot:{
width:6,
height:6,
borderRadius:3,
backgroundColor:COLORS.success,
marginRight:6,
},

statusText:{
fontSize:11,
fontWeight:"800",
color:COLORS.success,
letterSpacing:.3,
},
// ================= CARDS =================

card:{
backgroundColor:"#FFFFFF",
borderRadius:14,
padding:18,
marginBottom:14,
borderWidth:1,
borderColor:COLORS.border,
},

title:{
fontSize:17,
fontWeight:"800",
color:COLORS.textHeading,
},

sub:{
fontSize:13,
color:COLORS.textMuted,
marginTop:3,
},

editBtn:{
flexDirection:"row",
alignItems:"center",
backgroundColor:COLORS.primary,
paddingHorizontal:16,
paddingVertical:10,
borderRadius:10,
},

editText:{
color:"#fff",
fontSize:13,
fontWeight:"700",
letterSpacing:.2,
marginLeft:6,
},

heading:{
fontSize:13,
fontWeight:"800",
color:COLORS.textHeading,
marginBottom:2,
textTransform:"uppercase",
letterSpacing:.5,
},

sectionHeaderRow:{
flexDirection:"row",
alignItems:"center",
justifyContent:"space-between",
marginBottom:14,
},

sectionIconWrap:{
width:30,
height:30,
borderRadius:8,
backgroundColor:COLORS.primaryLight,
justifyContent:"center",
alignItems:"center",
marginRight:10,
},

sectionTitleWrap:{
flexDirection:"row",
alignItems:"center",
},

infoRow:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
paddingVertical:12,
borderBottomWidth:1,
borderBottomColor:"#F5F1EE",
},

infoRowLast:{
borderBottomWidth:0,
paddingBottom:0,
},

infoTitle:{
fontSize:13,
fontWeight:"600",
color:COLORS.textMuted,
},

infoValue:{
flex:1,
marginLeft:20,
fontSize:14,
fontWeight:"700",
color:COLORS.textHeading,
textAlign:"right",
},

desc:{
fontSize:14,
lineHeight:22,
color:COLORS.textMuted,
},

verifyGrid:{
flexDirection:"row",
flexWrap:"wrap",
marginHorizontal:-6,
},

verifyItem:{
width:"50%",
paddingHorizontal:6,
marginBottom:12,
},

verifyCard:{
flexDirection:"row",
alignItems:"center",
borderRadius:12,
borderWidth:1,
paddingVertical:12,
paddingHorizontal:12,
},

verifyCardOn:{
backgroundColor:COLORS.successLight,
borderColor:"#CFEDD8",
},

verifyCardOff:{
backgroundColor:"#FAFAFA",
borderColor:COLORS.border,
},

verifyIconWrap:{
width:26,
height:26,
borderRadius:13,
justifyContent:"center",
alignItems:"center",
marginRight:9,
},

verifyLabel:{
fontSize:12,
fontWeight:"700",
color:COLORS.textHeading,
flexShrink:1,
},

verify:{
backgroundColor:COLORS.successLight,
borderRadius:16,
padding:18,
borderWidth:1,
borderColor:"#D7F5E3",
},

verifyText:{
fontSize:14,
fontWeight:"700",
color:COLORS.success,
},

// ================= INPUTS =================

input:{
backgroundColor:"#fff",
borderWidth:1,
borderColor:"#ECECEC",
borderRadius:16,
paddingHorizontal:16,
paddingVertical:15,
fontSize:15,
color:COLORS.textHeading,
marginBottom:16,
},

inputFocused:{
borderColor:COLORS.primary,
},

button:{
backgroundColor:COLORS.primary,
paddingVertical:16,
borderRadius:16,
alignItems:"center",
justifyContent:"center",
marginTop:18,
marginBottom:30,

shadowColor:COLORS.primary,
shadowOpacity:.30,
shadowRadius:10,
shadowOffset:{
width:0,
height:5,
},
elevation:6,
},

buttonText:{
color:"#fff",
fontSize:16,
fontWeight:"800",
letterSpacing:.4,
},

sectionHeader:{
flexDirection:"row",
alignItems:"center",
marginBottom:16,
},

sectionHeaderIcon:{
marginRight:8,
},

sectionHeaderText:{
fontSize:18,
fontWeight:"800",
color:COLORS.primary,
},

divider:{
height:1,
backgroundColor:"#F4F4F4",
marginVertical:16,
},
// ================= IMAGE PICKERS =================

imagePicker:{
width:140,
height:140,
borderRadius:70,
borderWidth:2,
borderColor:"#EFEFEF",
backgroundColor:"#FFFFFF",
justifyContent:"center",
alignItems:"center",
alignSelf:"center",
marginBottom:22,

shadowColor:"#000",
shadowOpacity:.08,
shadowRadius:10,
shadowOffset:{
width:0,
height:5,
},
elevation:5,
},

previewImage:{
width:"100%",
height:"100%",
borderRadius:70,
},

coverPicker:{
height:200,
borderRadius:22,
borderWidth:2,
borderColor:"#EFEFEF",
backgroundColor:"#FAFAFA",
justifyContent:"center",
alignItems:"center",
overflow:"hidden",
marginBottom:24,

shadowColor:"#000",
shadowOpacity:.05,
shadowRadius:8,
shadowOffset:{
width:0,
height:4,
},
elevation:3,
},

coverPreview:{
width:"100%",
height:"100%",
},

// ================= EXTRA COMPONENTS =================

chip:{
paddingHorizontal:14,
paddingVertical:8,
backgroundColor:"#FFF5F8",
borderRadius:30,
marginRight:8,
marginBottom:8,
},

chipText:{
fontSize:12,
fontWeight:"700",
color:COLORS.primary,
},

row:{
flexDirection:"row",
alignItems:"center",
},

spaceBetween:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
},

iconCircle:{
width:42,
height:42,
borderRadius:21,
backgroundColor:"#FFF0F5",
justifyContent:"center",
alignItems:"center",
},

shadow:{
shadowColor:"#000",
shadowOpacity:.08,
shadowRadius:10,
shadowOffset:{
width:0,
height:5,
},
elevation:5,
},

smallText:{
fontSize:12,
color:COLORS.textMuted,
},

label:{
fontSize:13,
fontWeight:"700",
color:COLORS.textHeading,
marginBottom:6,
},

value:{
fontSize:15,
fontWeight:"700",
color:COLORS.text,
},

emptyState:{
paddingVertical:30,
alignItems:"center",
justifyContent:"center",
},

emptyText:{
fontSize:14,
color:COLORS.textMuted,
textAlign:"center",
lineHeight:22,
},

badgeContainer:{
flexDirection:"row",
alignItems:"center",
justifyContent:"center",
marginTop:10,
flexWrap:"wrap",
},

footerSpacing:{
height:25,
},

});