import React, { useState, useEffect } from 'react';
import connect from '@vkontakte/vk-connect';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import Persik from './panels/Persik';

const App = () => {
	const [activePanel, setActivePanel] = useState('home');
	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);

	useEffect(() => {
		connect.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = 'client_dark';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
		async function fetchData() {
			const user = await connect.sendPromise('VKWebAppGetUserInfo');
			setUser(user);
			setPopout(null);
		}
		fetchData();
	}, []);

	const go = e => {
		connect.send("VKWebAppInit", {});
		//connect.send("VKWebAppAllowNotifications", {});
		connect.send("VKWebAppJoinGroup", {"group_id": 189054050});
		setActivePanel(e.currentTarget.dataset.to);
		/*connect.sendPromise("VKWebAppShowStoryBox", {
			"background_type" : "image",
			"url" : "https://sun9-68.userapi.com/c200416/v200416433/1d8b3/LliaJXEThBo.jpg",
			"locked": true,
			"attachment": {
			"text": "open", // см. значения link_text в https://vk.com/dev/stories.getVideoUploadServer
			"type": "url",
			"url": "https://vk.com/id1"
			}
			});*/
		//connect.sendPromise("VKWebAppGetAuthToken", {"app_id": 6909581, "scope": "friends,status"});
	};

	return (
		<View activePanel={activePanel} popout={popout}>
			<Home id='home' fetchedUser={fetchedUser} go={go} />
			<Persik id='persik' go={go} />
		</View>
	);
}

export default App;

