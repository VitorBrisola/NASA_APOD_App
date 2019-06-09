import React from 'react';

import { Text } from 'react-native';

// stateless component
const APOD = () => (
    <Text>APOD</Text>    
);

APOD.navigationOptions = ({navigation}) => ({
    title: navigation.state.params.item.title,
    headerTitleStyle: {
        textAlign: 'center',
        flexGrow:1,
        alignSelf:'center',
    }, 
});


export default APOD;