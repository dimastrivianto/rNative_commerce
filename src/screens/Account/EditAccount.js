import React, {useState, useCallback} from 'react'
import { useSelector } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'
import {  Container, Header, Content, Form, Item, Input, Label, Button, Text} from 'native-base'
import { View, Image, StyleSheet, ActivityIndicatorBase} from 'react-native'
import ImagePicker from 'react-native-image-picker';
import axios from '../../config/api'
import { btn, bg } from '../../styles'
import Loading from '../Loading/Loading'



export default function EditAccount() {

    const [source, setSource] = useState({})
    const token = useSelector(state => state.auth.token)
    const [user, setUser] = useState({})

    const onChangeName = (text) => { setUser((prevUser) => {return {...prevUser, name: text}}) }
    const onChangeEmail = (text) => { setUser((prevUser) => {return {...prevUser, email: text}}) }
    const onChangePassword = (text) => { setUser((prevUser) => {return {...prevUser, password: text}}) }

    useFocusEffect(
        useCallback(() => {
            const config = {headers : {Authorization : token}}
            axios.get('/user', config)
            .then(res => {
               // res.data = {user, avatarlink}
                setUser(res.data.user)
                setSource({uri: res.data.avatarlink})
            })
            .catch(err =>console.log({err}))
        }, [])
    )



    const options = {
        title: 'Choose Avatar'
    };

    // mengupload gambar dari camera atau galery
    const onChooseImage = () => {
        ImagePicker.showImagePicker(options, (response) => {
            // console.log({response});
        
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri, type: response.type, name: response.fileName };
                setSource(source)
            }
        });
    }
    // console.log(source)

    // menyimpan gambar ke database
    const onSaveImage = () => {
        const config = {headers: {Authorization: token}}
        const data = new FormData()

        data.append("avatar", source)
        axios.post('/user/avatar', data, config)
        .then(res => console.log({res}))
        .catch(err => console.log({err}))
    }

     // menyimpan data (name, email, password)
    const onSaveData = () => {

        const config = {headers: {Authorization: token}}
        const data = {name: user.name, email: user.email, password: user.password}
        axios.patch('/user/profile', data, config)
        .then(res => console.log({res}))
        .catch(err => console.log({err}))
    }

    return source ? (
        <Container>
            <Content>
                {/* Image */}
                <View style={styles.photo} > 
                    <Image style={styles.image} source={source} />
                </View>

                {/* Button choose dan save */}
                <View style={styles.buttons} >
                    <Button style={[styles.btn,bg.purplesoft]} onPress={onChooseImage} >
                        <Text style={styles.btnText}>Choose</Text>
                    </Button>
                    <Button style={[styles.btn,bg.purplesoft]} onPress={onSaveImage} >
                        <Text style={styles.btnText}>Save</Text>
                    </Button>
                </View>

                {/* Ini Form */}
                <Form>
                    <Item stackedLabel>
                        <Label>Name</Label>
                        <Input value={user.name} onChangeText={onChangeName}  />
                    </Item>
                    <Item stackedLabel>
                        <Label>Email</Label>
                        <Input value={user.email} onChangeText={onChangeEmail}  />
                    </Item>
                    <Item stackedLabel last>
                        <Label>Password</Label>
                        <Input secureTextEntry onChangeText={onChangePassword} />
                    </Item>
                </Form>
                {/* Button Save */}
                <Button style={[styles.btn, bg.purplesoft, {alignSelf: 'center', marginTop: 20}]}  onPress={onSaveData} >
                    <Text style={styles.btnText} >Save</Text>
                </Button>

            </Content>
        </Container>
    ) : <Loading />
}

const styles = StyleSheet.create({
    photo : {
        width: 100,
        height: 100 ,
        borderWidth: 1,
        margin: 10,
        borderRadius: 100,
        alignSelf: 'center'
    },
    image : {
        width: '100%',
        height: '100%',
        borderRadius: 100
    },
    buttons: {
        alignSelf: 'center',
        width: '60%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    btn : {
        width: '45%',
        height: 30,
        borderRadius: 5,
    },
    btnText : {
        width: '100%',
        textAlign: 'center'
    }
    })


/*
Exercise
Edit Account
User dapat mengganti nama, email, password
*/


/*
android
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
*/