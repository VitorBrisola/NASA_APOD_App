import React, { Component } from 'react';

import { StyleSheet, View, Text, ImageBackground, FlatList, TouchableOpacity } from 'react-native';

//import axios from 'axios'
import api from '../services/api'
import color from '../config/color'
import { stringLiteral } from '@babel/types';



export default class Main extends Component {
    static navigationOptions = {
        title: "NASA APP",
        headerTitleStyle: {
            textAlign: 'center',
            flexGrow:1,
            alignSelf:'center',
        },    
    }; 

    state = {
        docs: [],
        n:0,
        lastDate: Date(),
    };

    componentDidMount(){
        this.loadData();
    };

    // format number into string with 2 elements
    pad = (number, size = 2) => {
        var s = String(number);
        while (s.length < (size || 2)) {s = "0" + s;}
        return s;
    };

    // transform Date object into string
    loadDate = ({date}) =>{
        return date.getFullYear().toString()+'-'+this.pad(date.getMonth() + 1)+'-' +this.pad(date.getDate());       
    };

    // Load last week from initial date
    loadPastWeek = ({initial_date}) => {
        var dates = [ initial_date ];
        for (i=1;i<=7;i++){
            var prevDay = new Date(initial_date.getTime() - i * 24 * 60 * 60 * 1000)
            dates = [... dates,  prevDay ]
        };

        return dates;
    };

    getAPOD = async (date) =>{          
        return await api.base.get('/apod?api_key='+api.key+'&date='+date)
            .catch(error => { console.log(error.message)});
    };

    loadAPOD = async (date) => {
        
        // loading APOD from API
        await this.getAPOD(date)
            .then(response => {response = response})
            .catch(error => { console.log(error)});

        // Adding APOD to the list
        /*var docs = [];
        if (this.state.docs.length > 0 ){
            docs = [...this.state.docs, response.data];
        }else{
            docs = [response.data];
        };*/  
        
        //this.setState({ docs: docs, n: docs.length });
       return response.data;           

    };

    // Using the arrow function, because it do not create a new function scope
    // enabling the use of 'this.'
    // * async and await is a easy form of working with promise
    loadData = async ( startDate = new Date()) => {
        
        console.log('starting...');

        // loading dates
        var dates = this.loadPastWeek({initial_date: startDate});
        console.log(dates);
        var stringDates = [];

        var aux = dates.pop();
        console.log(aux);
        
        // transforming dates to string
        dates.map(date => {
            var response = this.loadDate({date: date});
            stringDates.push(response);
        });
        console.log(stringDates);


        docs = [];
        // loading promises
        await Promise.all(stringDates.map( async stringDate => 
            ( await this.getAPOD(stringDate)
                            .then(response => {
                                data = response.data;
                                console.log(data);
                                docs = [...docs,data];})
                            .catch(error => {console.log(error.message)})
                
                )));
        
        await this.setState({ docs: [... this.state.docs,... docs], n: docs.length,lastDate: aux });
        console.log(this.state.lastDate);

        

    };


    loadMore = () => {
        this.loadData(this.state.lastDate);
    };

    renderItem = ({ item }) => (
        <View 
        style={styles.APODsContainer}>
            <ImageBackground
                style={styles.APODimg}
                imageStyle={{ borderRadius: 5 }}
                source={{uri: item.url}}>
                    <View style={styles.APODhead}>
                        <Text style={styles.APODdate}>{item.date}</Text>
                    </View>
                    <View style={styles.APODbase}>
                        <Text style={styles.APODtitle}>{item.title}</Text>
                        <Text style={styles.APODdesc} numberOfLines={2}>{item.explanation}</Text>
                        
                        <TouchableOpacity 
                            style={styles.APODbutton} 
                            onPress={() => {this.props.navigation.navigate('APOD', {item})}}>
                            <Text style={styles.APODbuttonText}>read more...</Text>
                        </TouchableOpacity>
                    </View>
                    
            </ImageBackground>       
        </View> 
    );

    render () {
        return (
            <View style={styles.container}>
                <FlatList 
                    contentContainerStyle={styles.list}
                    data={this.state.docs}
                    keyExtractor={(item, key) => key.toString()}
                    renderItem={this.renderItem}
                    onEndReached={this.loadMore}
                    onEndReachedThreshold={0.1}
                />      
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1, // make the container fill the screen
        backgroundColor: '#DDD',
    },
    list: {
        padding: 20,
    },
    APODsContainer: {
      height: 200,
      marginHorizontal: 3,
      marginVertical: 5,
      padding: 0,
      backgroundColor: '#FFF', 
      borderWidth: 1,
      borderColor: '#DDD',
      borderRadius: 5,
    },
    APODimg: {
      width: '100%', 
      height: '100%',   
    },
    APODhead: {    
      flexDirection: 'row',
      width: '100%', 
    },
    APODdate: {
      alignSelf: 'flex-end',
      fontSize: 12,
      color: color.textDefault,
    },
    APODbase: {
      width: '100%',
      position: 'absolute',
      bottom: 0,
      backgroundColor: color.statusBar,
      opacity: 0.8, 
      padding: 5,
      borderRadius: 5,
    },
    APODtitle:{
        alignSelf: 'flex-start',
        fontSize: 16,
        fontWeight: 'bold',
        color: color.textDefault,
      },
    APODdesc:{
      fontSize: 1,
      fontSize: 12,
      color: color.textDefault,
    },
    APODbutton: {
        borderRadius: 5,
        borderWidth: 2,
        borderColor: color.textDefault,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
    },
    APODbuttonText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: color.textDefault,
    }
  });