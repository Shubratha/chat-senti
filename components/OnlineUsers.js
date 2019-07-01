import React, { Component, Fragment } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';

class OnlineUsers extends Component {

	state = {}

	render() {

		let userList = {
			// marginTop: '30em',
			paddingTop: '13em',
			marginLeft: '-14em'
		};
		
		console.log(this.props.roomUsers)
		return (
			<div className="border-bottom border-gray w-100 d-flex align-items-center" style={{ height: 90 }}>
				<h2 className="text-dark mb-0 mx-4 px-2">Online Users</h2>
				<div>
				<ul style={userList}>
					{this.props.roomUsers.map((item, index) => {
						return (
							<li key={index}> {item} </li>
						);
					})}
				</ul>
				</div>
			</div>
		)
	}

}

export default OnlineUsers;