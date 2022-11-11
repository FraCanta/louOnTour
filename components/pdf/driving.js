import React, { useState } from "react";
import {
  Page,
  Text,
  Document,
  StyleSheet,
  PDFDownloadLink,
  Image as ImageComponent,
  View,
  Svg,
  Path,
  Link as LinkPDF,
} from "@react-pdf/renderer";

const Driving = () => {
  const [isClient, setIsClient] = useState(false);

  return (
    <div className="flex justify-end items-end mb-[50px]">
      {isClient && (
        <PDFDownloadLink document={<PdfFile />} fileName="Driving_Tuscany.pdf">
          {({ loading }) =>
            loading ? (
              <button className="btn loading">Loading Document ... </button>
            ) : (
              <button className="btn gap-2">Scarica Guida</button>
            )
          }
        </PDFDownloadLink>
      )}
    </div>
  );
};

export default Driving;

const PdfFile = () => {
  const styles = StyleSheet.create({
    body: {
      paddingTop: 15,
      paddingBottom: 65,
      paddingHorizontal: 35,
    },
    title: {
      fontSize: 24,
      textAlign: "center",
      color: "teal",
    },
    subtitle: {
      fontSize: 18,
      margin: 12,
      color: "grey",
      textAlign: "center",
      marginBottom: 10,
    },
    subtitle2: {
      fontSize: 13,
      margin: 12,
      color: "#212529",
      textAlign: "center",
      marginBottom: 10,
    },
    text: {
      fontSize: 12,
      lineHeight: 2.5,
      color: "#212529",
    },
    text2: {
      margin: 12,
      fontSize: 12,
      lineHeight: 1.8,
      color: "#212529",
    },
    image: {
      marginVertical: 15,
      marginHorizontal: 100,
      marginLeft: 12,
      width: "90%",
    },
    header: {
      fontSize: 12,
      marginBottom: 20,
      textAlign: "center",
      color: "grey",
    },
    desc: {
      fontSize: 18,
      margin: 12,
      color: "grey",
      textAlign: "center",
    },

    equip_list_item: {
      display: "flex",
      fontSize: 12,
      lineHeight: 1.8,
    },

    pageNumber: {
      position: "absolute",
      fontSize: 12,
      bottom: 30,
      left: 0,
      right: 0,
      textAlign: "center",
      color: "grey",
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.body} wrap>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};
