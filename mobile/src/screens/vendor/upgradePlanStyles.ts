import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/theme";


export const styles = StyleSheet.create({

container:{
  flex:1,
  backgroundColor:COLORS.background,
},


content:{
  padding:20,
},


title:{
  fontSize:26,
  fontWeight:"800",
  color:COLORS.text,
},


subtitle:{
  marginTop:8,
  color:COLORS.textMuted,
  marginBottom:20,
},


card:{
  backgroundColor:"#fff",
  borderRadius:18,
  padding:18,
  marginBottom:18,
  elevation:3,
},


selectedCard:{
  borderWidth:2,
  borderColor:COLORS.primary,
},


headerRow:{
  flexDirection:"row",
  alignItems:"center",
  gap:15,
},


planName:{
  fontSize:22,
  fontWeight:"800",
  color:COLORS.text,
},


price:{
  fontSize:16,
  fontWeight:"700",
  color:COLORS.primary,
},


description:{
  marginTop:15,
  color:COLORS.textMuted,
},


featureRow:{
  flexDirection:"row",
  alignItems:"center",
  marginTop:10,
},


feature:{
  marginLeft:8,
  color:COLORS.text,
},


button:{
  marginTop:18,
  backgroundColor:COLORS.primary,
  padding:12,
  borderRadius:10,
  alignItems:"center",
},


buttonText:{
  color:"#fff",
  fontWeight:"700",
},


// ==========================
// Monthly / Yearly toggle
// ==========================

toggleRow:{
  flexDirection:"row",
  backgroundColor:"#F2F2F2",
  borderRadius:12,
  padding:4,
  marginBottom:20,
},

toggleOption:{
  flex:1,
  paddingVertical:10,
  borderRadius:10,
  alignItems:"center",
  flexDirection:"row",
  justifyContent:"center",
  gap:6,
},

toggleOptionActive:{
  backgroundColor:COLORS.primary,
},

toggleText:{
  fontSize:14,
  fontWeight:"600",
  color:"#666",
},

toggleTextActive:{
  color:"#fff",
},

saveBadge:{
  backgroundColor:"#4CAF50",
  borderRadius:6,
  paddingHorizontal:6,
  paddingVertical:2,
},

saveBadgeText:{
  color:"#fff",
  fontSize:10,
  fontWeight:"700",
},


// ==========================
// Plan name row / current plan pill / savings note
// ==========================

planNameRow:{
  flexDirection:"row",
  alignItems:"center",
  gap:8,
},

currentPill:{
  backgroundColor:"#E8F5E9",
  borderRadius:8,
  paddingHorizontal:8,
  paddingVertical:2,
},

currentPillText:{
  color:"#2E7D32",
  fontSize:11,
  fontWeight:"700",
},

savingsNote:{
  fontSize:12,
  color:"#4CAF50",
  marginTop:2,
},


});