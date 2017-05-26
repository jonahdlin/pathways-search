import React from 'react';
import {Redirect} from 'react-router-dom';
import {Col, Glyphicon, Navbar, Nav, NavItem, NavDropdown, MenuItem, OverlayTrigger, Popover} from 'react-bootstrap';
import {get, traverse} from 'pathway-commons';

import {ErrorMessage} from '../components/ErrorMessage.jsx';
import {Graph} from './tabs/graph/Graph.jsx';
import {ModalFramework} from './components/ModalFramework.jsx';

// View
// Prop Dependencies ::
// - query
export class View extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {},
			name: "",
			datasource: "",
			show: false
		};

		get()
			.uri(this.props.query.uri)
			.format("SBGN")
			.fetch()
			.then(responseText => this.setState({data: responseText}));

		traverse()
			.uri(this.props.query.uri)
			.path("Named/displayName")
			.format("json")
			.fetch()
			.then(responseObject => this.setState({name: responseObject.traverseEntry[0].value.pop()}));

		traverse()
			.uri(this.props.query.uri)
			.path("Entity/dataSource/displayName")
			.format("json")
			.fetch()
			.then(responseObject => this.setState({datasource: responseObject.traverseEntry[0].value.pop()}));
	}

	render() {
		const tip_screenshot = (
			<Popover className="info-tip hidden-xs" id="popover-screenshot" placement="bottom" title="Screenshot">
				Click to download an image (png) of the current view.
			</Popover>
		);
		const tip_downloads = (
			<Popover className="info-tip hidden-xs" id="popover-downloads" placement="bottom" title="Downloads">
				Download in several different formats.
			</Popover>
		);
		const tip_metadata = (
			<Popover className="info-tip hidden-xs" id="popover-metadata" placement="bottom" title="Info">
				Click to see information provided by the original datasource.
			</Popover>
		);
		const tip_help = (
			<Popover className="info-tip hidden-xs" id="popover-help" placement="bottom" title="Help">
				Information about the viewer.
			</Popover>
		);
		if(this.state.data) {
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
											<div id="metadata">{this.state.name ? this.state.name : this.props.query.uri} | {this.state.datasource}</div>
										</OverlayTrigger>
									</NavItem>
								</Nav>
								<Nav pullRight>
									<NavItem eventKey={1} onClick={() => this.props.graphImage(false)}>
										<OverlayTrigger delayShow={1000} placement="bottom" overlay={tip_screenshot}>
											<span className="navitem-label">Screenshot</span>
										</OverlayTrigger>
									</NavItem>
									<NavItem eventKey={2} onClick={() => this.setState({active: "Downloads"})}>
										<OverlayTrigger delayShow={1000} placement="bottom" overlay={tip_downloads}>
											<span className="navitem-label">Downloads</span>
										</OverlayTrigger>
									</NavItem>
								</Nav>
							</Navbar.Collapse>
						</Navbar>)
					}
					<Graph data={this.state.data} {...this.props}/>
					{/* Menu Modal */}
					<ModalFramework onHide={() => this.setState({active: ""})} {...this.state} {...this.props}/>
				</div>
			);
		}
		else if(this.state.data === null) {
			return (
				<ErrorMessage className="View">
					Invalid URI
				</ErrorMessage>
			);
		}
		else {
			return(null);
		}
	}
}
