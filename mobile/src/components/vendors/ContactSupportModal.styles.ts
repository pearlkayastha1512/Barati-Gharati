import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  overlay:{
    flex:1,
    backgroundColor:"rgba(0,0,0,0.45)",
    justifyContent:"center",
    alignItems:"center"
  },


  container:{
    width:"85%",
    backgroundColor:"#fff",
    borderRadius:20,
    padding:24
  },


  header:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    marginBottom:15
  },


  title:{
    fontSize:20,
    fontWeight:"700",
    color:"#333"
  },


  subtitle:{
    fontSize:16,
    marginBottom:20,
    color:"#555"
  },


  infoRow:{
    flexDirection:"row",
    alignItems:"center",
    marginBottom:18,
    gap:12
  },


  infoText:{
    fontSize:15,
    color:"#444"
  },


  message:{
    marginVertical:15,
    color:"#666",
    fontSize:14
  },


  primaryButton:{
    backgroundColor:"#C2185B",
    padding:14,
    borderRadius:12,
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    gap:8,
    marginBottom:12
  },


  primaryText:{
    color:"#fff",
    fontWeight:"600"
  },


  secondaryButton:{
    borderWidth:1,
    borderColor:"#C2185B",
    padding:14,
    borderRadius:12,
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    gap:8,
    marginBottom:12
  },


  secondaryText:{
    color:"#C2185B",
    fontWeight:"600"
  },


  closeButton:{
    padding:12,
    alignItems:"center"
  },


  closeText:{
    color:"#777",
    fontWeight:"600"
  }

});