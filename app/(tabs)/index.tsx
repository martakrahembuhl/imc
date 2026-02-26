import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { globalStyles } from '../../constants/styles';
import { colors } from '../../constants/colors';
import InputField from './../components/InputField';

type ResultadoIMC = {
  texto: string;
  cor: string;
};

export default function HomeScreen() {
  const [peso, setPeso] = useState<string>('');
  const [altura, setAltura] = useState<string>('');
  const [resultado, setResultado] = useState<ResultadoIMC | null>(null);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 800,
          useNativeDriver: true
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true
        })
      ])
    ).start();
  }, []);

  function calcularIMC() {
    const pesoNum = parseFloat(peso.replace(',', '.'));
    const alturaNum = parseFloat(altura.replace(',', '.')) / 100;

    if (!pesoNum || !alturaNum) {
      setResultado({
        texto: 'Preencha os campos corretamente 😅',
        cor: colors.warning
      });
      return;
    }

    const imc = pesoNum / (alturaNum * alturaNum);

    let classificacao = '';
    let cor = '';

    if (imc < 18.5) {
      classificacao = 'Abaixo do peso 🍃';
      cor = colors.warning;
    } else if (imc < 25) {
      classificacao = 'Peso ideal 🎉';
      cor = colors.success;
    } else if (imc < 30) {
      classificacao = 'Sobrepeso ⚠️';
      cor = colors.warning;
    } else {
      classificacao = 'Obesidade 🚨';
      cor = colors.danger;
    }

    setResultado({
      texto: `IMC: ${imc.toFixed(1)}\n${classificacao}`,
      cor
    });
  }

  return (
    <ScrollView style={globalStyles.container}>

      {/* Cabeçalho */}
      <View style={{
        alignItems: 'center',
        paddingVertical: 30
      }}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <MaterialIcons
            name="fitness-center"
            size={90}
            color={colors.primary}
          />
        </Animated.View>

        <Text style={{
          fontSize: 26,
          fontWeight: 'bold',
          color: colors.primary,
          marginTop: 10
        }}>
          Calculadora IMC
        </Text>

        <Text style={{
          color: colors.textSecondary,
          marginTop: 5
        }}>
          Descubra sua classificação corporal
        </Text>
      </View>

      {/* Card */}
      <View style={{
        backgroundColor: colors.card,
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 15,
        elevation: 5
      }}>
        <InputField
          label="Peso (kg)"
          value={peso}
          onChangeText={setPeso}
          placeholder="Ex: 70.5"
          keyboardType="numeric"
        />

        <InputField
          label="Altura (cm)"
          value={altura}
          onChangeText={setAltura}
          placeholder="Ex: 175"
          keyboardType="numeric"
        />

        {/* Botão */}
        <TouchableOpacity
          onPress={calcularIMC}
          style={{
            backgroundColor: colors.primary,
            padding: 15,
            borderRadius: 12,
            marginTop: 15,
            alignItems: 'center'
          }}
        >
          <Text style={{
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 16
          }}>
            Calcular IMC
          </Text>
        </TouchableOpacity>

        {/* Resultado */}
        {resultado && (
          <View style={{
            marginTop: 20,
            padding: 15,
            borderRadius: 12,
            backgroundColor: `${resultado.cor}20`
          }}>
            <Text style={{
              textAlign: 'center',
              fontSize: 18,
              fontWeight: 'bold',
              color: resultado.cor
            }}>
              {resultado.texto}
            </Text>
          </View>
        )}
      </View>

    </ScrollView>
  );
}