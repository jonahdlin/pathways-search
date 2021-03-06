import React from 'react';
import {Col, Glyphicon, Navbar, Nav, NavItem, OverlayTrigger, Popover} from 'react-bootstrap';
import {saveAs} from 'file-saver';
import queryString from 'query-string';

import {ErrorMessage} from '../components/ErrorMessage.jsx';
import {Graph} from './components/graph/Graph.jsx';
import {ModalFramework} from './components/menu/ModalFramework.jsx';

import cyInit from './cy/init';

import PathwayCommonsService from '../services/pathwayCommons/';

// View
// Prop Dependencies ::
// - query
// - history
// - logPageView
// - logEvent

export class View extends React.Component {
  constructor(props) {
    super(props);
    const query = queryString.parse(props.location.search);
    this.state = {
      query: query,
      cy: cyInit({ headless: true }), // cytoscape mounted after Graph component has mounted
      sbgnText: {},
      name: '',
      datasource: '',
      comments: []
    };

    PathwayCommonsService.query(query.uri, 'SBGN')
      .then(responseText => {
        this.setState({
          sbgnText: responseText
        });
      });

    PathwayCommonsService.query(query.uri, 'json', 'Named/displayName')
      .then(responseObj => {
        const title = responseObj ? responseObj.traverseEntry[0].value.pop() : '';
        document.title = title;
        this.setState({
          name: title
        });
      });

    PathwayCommonsService.query(query.uri, 'json', 'Entity/dataSource/displayName')
      .then(responseObj => {
        this.setState({
          datasource: responseObj ? responseObj.traverseEntry[0].value.pop() : ''
        });
      });

    PathwayCommonsService.query(query.uri, 'json', 'Entity/comment')
      .then(responses => {
        const comments_arr = responses ? responses.traverseEntry[0].value : [];
        var comments_str = '';
        comments_arr.map(comment => {
          comments_str += comment+'\n';
        });
        const metas = document.getElementsByTagName('meta');
        for (var i = 0; i < metas.length; i++) {
          if (metas[i].getAttribute('name') == 'description') {
            metas[i].setAttribute('content', comments_str);
          }
        }
        this.setState({
          comments: comments_arr
        });
      });

    props.logPageView( props.history.location );
    props.logEvent({
      category: 'View',
      action: 'view',
      label: query.uri
    });
  }

  componentWillReceiveProps( nextProps ) {
    const locationChanged = nextProps.location !== this.props.location;
    if( locationChanged ){
      this.props.logEvent({
        category: 'View',
        action: 'view',
        label: this.state.query.uri
      });
    }
  }

  render() {
    const tip_help = (
      <Popover className="info-tip hidden-xs" id="popover-help" placement="bottom" title="Help">
        A field guide to interpreting the display.
      </Popover>
    );
    const tip_screenshot = (
      <Popover className="info-tip hidden-xs" id="popover-screenshot" placement="bottom" title="Screenshot">
        Click to download an image (png) of the current view.
      </Popover>
    );
    const tip_downloads = (
      <Popover className="info-tip hidden-xs" id="popover-downloads" placement="bottom" title="Downloads Menu">
        View the different file formats available.
      </Popover>
    );
    const tip_metadata = (
      <Popover className="info-tip hidden-xs" id="popover-metadata" placement="bottom" title="Info">
        Click to see information provided by the original datasource.
      </Popover>
    );

    if(this.state.sbgnText) {
      return(
        <div className="View">
          { !this.props.embed &&
            (<Navbar collapseOnSelect>
              <Navbar.Header>
                <Col xsOffset={1} xs={9} smOffset={0} sm={2}>
                  <span className="brand">View</span>
                </Col>
                <Navbar.Toggle />
              </Navbar.Header>
              <Navbar.Collapse>
                <Nav>
                  <NavItem eventKey={1} onClick={() => this.setState({active: "Information"})}>
                    <OverlayTrigger delayShow={1000} placement="bottom" overlay={tip_metadata}>
                      <div id="metadata">{this.state.name ? this.state.name : this.state.query.uri} | {this.state.datasource}</div>
                    </OverlayTrigger>
                  </NavItem>
                </Nav>
                <Nav pullRight>
                  <NavItem eventKey={1} onClick={() => {
                    const imgBlob = this.state.cy.png({output: 'blob', scale: 5, bg: 'white',full: true});
                    saveAs(imgBlob, this.state.name  + '.png');}}>
                    <Col xsHidden >
                      <OverlayTrigger delayShow={1000} placement="bottom" overlay={tip_screenshot}>
                        <Glyphicon className="glyph-tip" glyph="picture" />
                      </OverlayTrigger>
                    </Col>
                    <Col smHidden mdHidden lgHidden>
                      <span className="navitem-label">Screenshot</span>
                    </Col>
                  </NavItem>
                  <NavItem eventKey={2} onClick={() => this.setState({active: "Downloads"})}>
                    <Col xsHidden >
                      <OverlayTrigger delayShow={1000} placement="bottom" overlay={tip_downloads}>
                        <Glyphicon className="glyph-tip" glyph="download-alt" />
                      </OverlayTrigger>
                    </Col>
                    <Col smHidden mdHidden lgHidden >
                      <span className="navitem-label">Downloads</span>
                    </Col>
                  </NavItem>
                  <NavItem eventKey={3} onClick={() => this.setState({active: "Help"})}>
                    <Col xsHidden >
                      <OverlayTrigger delayShow={1000} placement="bottom" overlay={tip_help}>
                        <Glyphicon className="glyph-tip" glyph="question-sign" />
                      </OverlayTrigger>
                    </Col>
                    <Col smHidden mdHidden lgHidden >
                      <span className="navitem-label">Help</span>
                    </Col>
                  </NavItem>
                </Nav>
              </Navbar.Collapse>
            </Navbar>)
          }
          <Graph cy={this.state.cy} sbgnText={this.state.sbgnText} {...this.props}/>
          {/* Menu Modal */}
          <ModalFramework cy={this.state.cy} comments={this.state.comments} onHide={() => this.setState({active: ''})} {...this.state} {...this.props}/>
        </div>
      );
    }
    else  {
      return (
        <ErrorMessage className="View">
          Invalid URI
        </ErrorMessage>
      );
    }
  }
}
