// Mengimpor modul yang diperlukan dari React dan React Native
import React, { useEffect, useState } from 'react'
import {
  View, // Komponen untuk membuat container
  Text, // Komponen untuk menampilkan teks
  FlatList, // Komponen untuk membuat daftar bergulir
  StyleSheet, // Modul untuk membuat style CSS di React Native
  ImageBackground, // Komponen untuk menampilkan gambar latar belakang
  TouchableOpacity, // Komponen untuk membuat tombol yang bisa disentuh
  SafeAreaView, // Komponen untuk memastikan konten berada di area aman perangkat
} from 'react-native'
import {
  useRoute,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native'
import { API_ACCESS_TOKEN } from '@env'
import { FontAwesome } from '@expo/vector-icons' // Mengimpor ikon dari FontAwesome
import { LinearGradient } from 'expo-linear-gradient' // Mengimpor LinearGradient untuk efek gradasi

// Mendefinisikan tipe untuk rute navigasi
type RootStackParamList = {
  MovieDetail: { id: number }
}

const CategorySearchResult = (): JSX.Element => {
  const route = useRoute() // Hook untuk mendapatkan parameter rute
  const navigation = useNavigation<NavigationProp<RootStackParamList>>() // Hook untuk navigasi dengan tipe yang telah didefinisikan
  const { genreId } = route.params as { genreId: number } // Mendapatkan parameter genreId dari rute
  const [movies, setMovies] = useState<any[]>([]) // State untuk menyimpan daftar film yang ditemukan

  // Hook useEffect untuk memanggil fungsi fetchMoviesByGenre saat komponen pertama kali dirender
  useEffect(() => {
    fetchMoviesByGenre() // Memanggil fetchMoviesByGenre saat komponen pertama kali dirender
  }, [])

  // Fungsi untuk mengambil daftar film berdasarkan genre dari API
  const fetchMoviesByGenre = async (): Promise<void> => {
    const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}` // URL untuk API
    const options = {
      method: 'GET', // Metode HTTP GET
      headers: {
        accept: 'application/json', // Menerima respons dalam format JSON
        Authorization: `Bearer ${API_ACCESS_TOKEN}`, // Menggunakan token akses dalam header Authorization
      },
    }

    try {
      const response = await fetch(url, options) // Mengirim permintaan ke API untuk mendapatkan daftar film berdasarkan genre
      const data = await response.json() // Mengurai respons JSON
      setMovies(data.results) // Menyimpan daftar film ke state
    } catch (error) {
      console.log(error) // Menampilkan kesalahan jika terjadi
    }
  }

  // Fungsi untuk merender setiap item film dalam daftar
  const renderMovieItem = ({ item }: { item: any }): JSX.Element => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('MovieDetail', { id: item.id })} // Navigasi ke layar detail film saat film dipilih
    >
      <ImageBackground
        resizeMode="cover"
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} // URL gambar poster film
      >
        <LinearGradient
          colors={['#00000000', 'rgba(0, 0, 0, 0.7)']} // Warna gradasi
          locations={[0.6, 0.8]} // Posisi gradasi
          style={styles.gradientStyle}
        >
          <Text style={styles.title}>{item.title}</Text>
          {/* Menampilkan judul film */}
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={16} color="yellow" />
            {/* Ikon bintang untuk rating */}
            <Text style={styles.rating}>
              {item.vote_average.toFixed(1)}
              {/* Menampilkan rating film */}
            </Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={movies} // Data yang akan dirender dalam daftar
          renderItem={renderMovieItem} // Fungsi untuk merender setiap item
          keyExtractor={(item) => item.id.toString()} // Menentukan kunci unik untuk setiap item
          numColumns={3} // Mengatur jumlah kolom menjadi 3
          showsVerticalScrollIndicator={false} // Menyembunyikan scrollbar vertikal
          contentContainerStyle={styles.listContent} // Menambahkan gaya untuk konten daftar
        />
      </View>
    </SafeAreaView>
  )
}

// Mendefinisikan gaya untuk komponen menggunakan StyleSheet
const styles = StyleSheet.create({
  safeArea: {
    flex: 1, // Mengisi seluruh ruang yang tersedia
    backgroundColor: 'white', // Warna latar belakang putih
  },
  container: {
    flex: 1, // Mengisi seluruh ruang yang tersedia
    padding: 16, // Menambahkan padding di sekitar kontainer
  },
  itemContainer: {
    flex: 1, // Membuat item memiliki ukuran fleksibel
    margin: 5, // Menambahkan margin sekitar item
  },
  backgroundImage: {
    aspectRatio: 2 / 3, // Mengatur rasio aspek 2:3
  },
  backgroundImageStyle: {
    borderRadius: 8, // Mengatur radius border gambar
  },
  gradientStyle: {
    padding: 8, // Menambahkan padding dalam gradien
    height: '100%', // Mengatur tinggi 100%
    width: '100%', // Mengatur lebar 100%
    borderRadius: 8, // Mengatur radius border
    display: 'flex', // Mengatur tampilan menjadi flexbox
    justifyContent: 'flex-end', // Menyelaraskan konten ke bawah
  },
  title: {
    color: 'white', // Mengatur warna teks judul film
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
  listContent: {
    paddingBottom: 20, // Menambahkan padding bawah untuk menghindari konten tertindih oleh navigasi
  },
})

// Mengekspor komponen CategorySearchResult agar dapat digunakan di tempat lain
export default CategorySearchResult
