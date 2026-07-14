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


});