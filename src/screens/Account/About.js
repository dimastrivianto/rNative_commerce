import React from 'react'
import { View, Text } from 'react-native'

export default function About() {
    return (
        <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 30, fontWeight: 'bold'}}>About Component</Text>
        </View>
    )
}
