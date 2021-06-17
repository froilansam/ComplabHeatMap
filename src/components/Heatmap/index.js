import React, { Component } from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { ContributionGraph } from "react-native-chart-kit";
import axios from "axios";
import moment from "moment";
import _ from "lodash";

class Heatmap extends Component {
  state = {
    commitsData: [],
  };

  componentDidMount() {
    this.getDates();
  }

  getDates = async () => {
    try {
      const {
        data: { records: dates },
      } = await axios.get(
        "https://api.adalo.com/v0/apps/89f3044b-2671-4e50-b746-1d6aee50633a/collections/t_cib5vvnlp3y4wqu46a41841zx",
        { headers: { Authorization: "Bearer 4qpmbm8v0clp31s1awgl6xym5" } }
      );

      let sortedDates = dates
        .sort((a, b) => moment(a.Date).valueOf() - moment(b.Date).valueOf())
        .map((date) => date.Date)
        .filter((date) => date !== null);

      const commitsData = [];
      const countedDates = _.countBy(sortedDates);
      for (const [key, value] of Object.entries(countedDates)) {
        commitsData.push({
          date: moment(key).format("YYYY-MM-DD"),
          count: value,
        });
      }

      this.setState({ commitsData });
    } catch (e) {
      throw e;
    }
  };

  render() {
    return (
      <View style={styles.wrapper}>
        <ContributionGraph
          values={this.state.commitsData}
          endDate={
            this.state.commitsData?.length > 0
              ? new Date(
                  this.state.commitsData[this.state.commitsData.length - 1].date
                )
              : new Date()
          }
          numDays={105}
          width={Dimensions.get("window").width}
          height={220}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#d1d1d1",
            backgroundGradientTo: "#000000",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#000000",
            },
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Heatmap;
