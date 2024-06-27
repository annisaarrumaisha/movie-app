// Mengimpor React untuk mendukung penulisan komponen dengan JSX
import React, { useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage' // Mengimpor AsyncStorage untuk penyimpanan lokal
import { useFocusEffect } from '@react-navigation/native' // Import useFocusEffect untuk merespon fokus navigasi

import { FontAwesome } from '@expo/vector-icons' // Mengimpor ikon FontAwesome
import { LinearGradient } from 'expo-linear-gradient' // Mengimpor LinearGradient dari expo-linear-gradient

const { width } = Dimensions.get('window') // Mendapatkan lebar layar untuk mengatur ukuran kolom

// Mendefinisikan komponen Favorite yang merupakan komponen fungsional
export default function Favorite({ navigation }: any): JSX.Element {
  const [favorites, setFavorites] = useState<any[]>([]) // State untuk menyimpan daftar film favorit

  // Fungsi untuk mengambil daftar film favorit dari AsyncStorage
  const loadFavorites = async (): Promise<void> => {
    try {
      const initialData: string | null =
        await AsyncStorage.getItem('@FavoriteList')
      if (initialData) {
        setFavorites(JSON.parse(initialData)) // Mengatur state favorites dengan data yang diambil dari AsyncStorage
      }
    } catch (error) {
      console.log(error) // Menampilkan kesalahan jika proses gagal
    }
  }

  // Gunakan useFocusEffect untuk memuat ulang daftar favorit saat layar difokuskan
  useFocusEffect(
    useCallback(() => {
      loadFavorites() // Memanggil fungsi loadFavorites
    }, []),
  )

  // Mengembalikan elemen UI untuk komponen Favorite
  return (
    <View style={styles.container}>
      <FlatList
        data={favorites} // Menetapkan data dari state favorites
        keyExtractor={(item) => item.id.toString()} // Menentukan kunci unik untuk setiap item dalam daftar
        numColumns={3} // Mengatur jumlah kolom menjadi 3
        showsVerticalScrollIndicator={false} // Menyembunyikan scrollbar vertikal
        showsHorizontalScrollIndicator={false} // Menyembunyikan scrollbar horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navigation.navigate('MovieDetail', { id: item.id })} // Menavigasi ke detail film saat item diklik
          >
            <ImageBackground
              resizeMode="cover"
              style={styles.backgroundImage} // Mengatur gaya backgroundImage
              imageStyle={styles.backgroundImageStyle} // Mengatur gaya gambar
              source={{
                uri: `https://image.tmdb.org/t/p/w200${item.poster_path}`,
              }} // Menampilkan gambar poster
            >
              <LinearGradient
                colors={['#00000000', 'rgba(0, 0, 0, 0.7)']} // Warna gradien
                locations={[0.6, 0.8]} // Lokasi gradien
                style={styles.gradientStyle} // Mengatur gaya gradien
              >
                <Text style={styles.title}>{item.title}</Text>
                {/* Menampilkan judul film */}
                <View style={styles.ratingContainer}>
                  <FontAwesome name="star" size={16} color="yellow" />
                  <Text style={styles.rating}>
                    {item.vote_average.toFixed(1)}
                  </Text>
                </View>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No favorite movies found.</Text>
        } // Menampilkan teks jika tidak ada film favorit
      />
    </View>
  )
}

// Mendefinisikan gaya untuk komponen
const styles = StyleSheet.create({
  container: {
    flex: 1, // Memastikan kontainer mengambil seluruh layar
    padding: 16, // Menambahkan padding di sekitar kontainer
  },
  itemContainer: {
    flex: 1 / 3, // Mengatur lebar item menjadi sepertiga dari lebar layar
    aspectRatio: 2 / 3, // Mengatur rasio aspek item
    margin: 4, // Menambahkan margin di sekitar item
  },
  backgroundImage: {
    flex: 1, // Memastikan poster mengambil seluruh ruang item
    borderRadius: 8, // Mengatur radius border gambar
    overflow: 'hidden', // Menyembunyikan konten yang melampaui batas border
  },
  backgroundImageStyle: {
    borderRadius: 8, // Mengatur radius border gambar
  },
  gradientStyle: {
    padding: 8, // Mengatur padding
    height: '100%', // Mengatur tinggi 100%
    width: '100%', // Mengatur lebar 100%
    borderRadius: 8, // Mengatur radius border
    display: 'flex', // Mengatur tampilan menjadi flexbox
    justifyContent: 'flex-end', // Mengatur konten di akhir (bawah)
  },
  title: {
    color: 'white', // Mengatur warna teks judul film
    fontSize: 14, // Mengatur ukuran font untuk judul
  },
  ratingContainer: {
    flexDirection: 'row', // Mengatur arah flex menjadi baris
    alignItems: 'center', // Menyelaraskan item ke tengah secara vertikal
    gap: 2, // Menambahkan jarak antar elemen
  },
  rating: {
    color: 'yellow', // Mengatur warna teks rating
    fontWeight: '700', // Mengatur ketebalan font
  },
  emptyText: {
    fontSize: 16, // Mengatur ukuran font untuk teks kosong
    textAlign: 'center', // Menyelaraskan teks di tengah secara horizontal
    marginTop: 20, // Menambahkan margin atas
  },
})
