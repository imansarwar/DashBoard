import React, { Component } from "react";
import "./dashboard.css";
import { Col, Row, Container } from "react-bootstrap";
import WidgetText from "./widgetText";
import WidgetBar from "./widgetBar";
import WidgetDoughnut from "./widgetDoughnut";
import WidgetCord from "./widgetCord";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

//excel import
const config = {
  apiKey: "AIzaSyDMu-Vw30ykPPmFT3cXeunzKEi4EahzglI",
  spreadsheetId: "1vcDPrMexD8bxNwwzK9IxF8wch6Hfezq2eooJACDiqgg"
};
const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values:batchGet?ranges=Sheet1&majorDimension=ROWS&key=${config.apiKey}`;

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      items: [],
      dropdownOptions: [],
      organicSource: null,
      directSource: null,
      socialSource: null,
      bounceRate: null,
      referralSource: null,
      sessions: null,
      pageViews: null,
      users: null,
      newUsers: null,
      sourceArr: [],
      usersArr: [],
      cordArr: []
    };
  }

  getData = (arg) => {
    const arr = this.state.items;
    const arrLen = arr.length;

    let organicSource = 0;
    let directSource = 0;
    let socialSource = 0;
    let referralSource = 0;
    let sessions = 0;
    let bounceRate = 0;
    let pageViews = 0;
    let users = 0;
    let newUsers = 0;
    let selectedValue = null;
    let sourceArr = [];
    let usersArr = [];
    let cordArr = [];

    for (let i = 0; i < arrLen; i++) {
      if (arg == arr[i]["month"]) {
        organicSource = arr[i].organic_source;
        directSource = arr[i].direct_source;
        socialSource = arr[i].social_source;
        bounceRate = arr[i].bounce_rate;
        sessions = arr[i].sessions;
        referralSource = arr[i].referral_source;
        pageViews = arr[i].page_views;
        users = arr[i].users;
        newUsers = arr[i].new_users;
        sourceArr.push(
          {
            label: "Organic Source",
            value: arr[i].organic_source
          },
          {
            label: "Direct Source",
            value: arr[i].direct_source
          },
          {
            label: "Referral Source",
            value: arr[i].referral_source
          }
        );

        usersArr.push(
          {
            label: "Users",
            value: arr[i].users
          },
          {
            label: "New Users",
            value: arr[i].new_users
          }
        );

        cordArr.push(
          {
            label: "Organic Source",
            value: arr[i].organic_source
          },

          {
            label: "User Source",
            value: arr[i].referral_source
          },

          {
            label: "Direct Source",
            value: arr[i].direct_source
          },
          {
            label: "Social Source",
            value: arr[i].social_source
          }
        );
      }
    }
    selectedValue = arg;

    this.setState({
      organicSource: organicSource,
      directSource: directSource,
      socialSource: socialSource,
      referralSource: referralSource,
      bounceRate: bounceRate,
      pageViews: pageViews,
      sessions: sessions,
      users: users,
      newUsers: newUsers,
      sourceArr: sourceArr,
      usersArr: usersArr,
      cordArr: cordArr
    });
  };

  updateDashboard = (event) => {
    this.getData(event.value);
    this.setState({ selectedValue: event.value }, () => {
      console.log(this.state.organicSource);
    });
  };

  componentDidMount() {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        let batchRowValues = data.valueRanges[0].values;
        const rows = [];
        for (let i = 1; i < batchRowValues.length; i++) {
          let rowObject = {};
          for (let j = 0; j < batchRowValues[i].length; j++) {
            rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
          }
          rows.push(rowObject);
        }

        // dropdown options
        let dropdownOptions = [];
        for (let i = 0; i < rows.length; i++) {
          dropdownOptions.push(rows[i].month);
        }
        dropdownOptions = Array.from(new Set(dropdownOptions)).reverse();
        this.setState(
          {
            items: rows,
            dropdownOptions: dropdownOptions,
            selectedValue: "Jan 2018"
          },
          () => this.getData("Jan 2018")
        );
      });
  }

  render() {
    return (
      <div>
        <Container fluid>
          <Row className="TopHeader">
            <Col>Dashboard</Col>

            <Col>
              <Dropdown
                options={this.state.dropdownOptions}
                onChange={this.updateDashboard}
                value={this.state.selectedValue}
                placeholder="Select an option"
              />
            </Col>
          </Row>
        </Container>

        <Container className="mainDashboard">
          <Row>
            <Col>
              <WidgetText
                title="Organic Source"
                value={this.state.organicSource}
              />
            </Col>
            <Col>
              <WidgetText
                title="Direct Source"
                value={this.state.directSource}
              />
            </Col>
            <Col>
              <WidgetText
                title="Referral Source"
                value={this.state.referralSource}
              />
            </Col>
            <Col>
              <WidgetText title="Page Views" value={this.state.pageViews} />
            </Col>
          </Row>

          <Row>
            <Col>
              <WidgetBar
                title="Source Comparison"
                data={this.state.sourceArr}
              />
            </Col>
            <Col>
              <WidgetDoughnut
                title="Users Comparison"
                data={this.state.usersArr}
              />{" "}
            </Col>
            <Col>
              <WidgetCord title="Widget grades" data={this.state.cordArr} />
            </Col>
          </Row>

          <Row>
            <Col>
              <WidgetText
                title="Social Source"
                value={this.state.socialSource}
              />
            </Col>
            <Col>
              <WidgetText
                title="Custom Source"
                value={this.state.directSource}
              />
            </Col>
            <Col>
              <WidgetText title="Bounce Rate " value={this.state.bounceRate} />
            </Col>
            <Col>
              <WidgetText title=" Sessions" value={this.state.sessions} />
            </Col>
          </Row>

          <Row className="BottomRow">Created by Syeda Iman Sarwar</Row>
        </Container>
      </div>
    );
  }
}

export default Dashboard;
