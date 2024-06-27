import React, { useState, useEffect } from 'react'
import {
  View, // Komponen untuk membuat container
  Text, // Komponen untuk menampilkan teks
  TouchableOpacity, // Komponen untuk membuat tombol yang bisa disentuh
  StyleSheet, // Modul untuk membuat style CSS di React Native
  FlatList, // Komponen untuk membuat daftar bergulir
} from 'react-native'
import { useNavigation } from '@react-navigation/native' // Hook untuk navigasi antar layar
import { API_ACCESS_TOKEN } from '@env' // Mengambil token akses API dari variabel lingkungan

// Definisikan tipe navigasi untuk memastikan tipe parameter yang benar
type CategorySearchNavigationProp = {
  navigate: (screen: string, params: { genreId: number }) => void
}

// Mendefinisikan komponen CategorySearch
const CategorySearch = (): JSX.Element => {
  // State untuk menyimpan daftar genre
  const [genres, setGenres] = useState<any[]>([])
  // State untuk genre yang dipilih
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null)
  // State untuk menyimpan daftar film
  const [movies, setMovies] = useState<any[]>([])
  // Menggunakan hook useNavigation untuk navigasi
  const navigation = useNavigation<CategorySearchNavigationProp>()

  // Mengambil daftar genre saat komponen dimuat
  useEffect(() => {
    fetchGenres()
  }, [])

  // Mencari film berdasarkan genre yang dipilih
  useEffect(() => {
    if (selectedGenre !== null) {
      searchMoviesByGenre()
    }
  }, [selectedGenre])

  // Fungsi untuk mengambil daftar genre dari API
  const fetchGenres = async (): Promise<void> => {
    const url = 'https://api.themoviedb.org/3/genre/movie/list' // URL untuk mengambil daftar genre
    const options = {
      method: 'GET', // Menggunakan metode GET untuk mengambil data
      headers: {
        accept: 'application/json', // Menerima respons dalam format JSON
        Authorization: `Bearer ${API_ACCESS_TOKEN}`, // Menggunakan token akses untuk otentikasi
      },
    }

    try {
      // Mengirim permintaan ke API dan menunggu respons
      const response = await fetch(url, options)
      // Mengurai respons JSON untuk mendapatkan data
      const data = await response.json()
      // Menyimpan daftar genre ke state
      setGenres(data.genres)
    } catch (error) {
      // Menangkap dan menampilkan kesalahan jika terjadi
      console.log(error)
    }
  }

  // Fungsi untuk menangani pencarian
  const handleSearch = () => {
    // Jika ada genre yang dipilih, navigasi ke layar hasil pencarian dengan parameter genreId
    if (selectedGenre !== null) {
      navigation.navigate('CategorySearchResult', { genreId: selectedGenre })
    }
  }

  // Fungsi untuk mencari film berdasarkan genre yang dipilih
  const searchMoviesByGenre = async (): Promise<void> => {
    // URL untuk mencari film berdasarkan genre yang dipilih
    const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${selectedGenre}`
    const options = {
      method: 'GET', // Menggunakan metode GET untuk mengambil data
      headers: {
        accept: 'application/json', // Menerima respons dalam format JSON
        Authorization: `Bearer ${API_ACCESS_TOKEN}`, // Menggunakan token akses untuk otentikasi
      },
    }

    try {
      // Mengirim permintaan ke API dan menunggu respons
      const response = await fetch(url, options)
      // Mengurai respons JSON untuk mendapatkan data
      const data = await response.json()
      // Menyimpan daftar film ke state
      setMovies(data.results)
    } catch (error) {
      // Menangkap dan menampilkan kesalahan jika terjadi
      console.log(error)
    }
  }

  // Fungsi untuk merender item genre dalam daftar
  const renderGenreItem = ({ item }: { item: any }): JSX.Element => (
    <TouchableOpacity
      key={item.id} // Menentukan kunci unik untuk setiap item genre
      style={{
        ...styles.genreItem, // Menggunakan gaya dari styles.genreItem
        backgroundColor: item.id === selectedGenre ? '#8978A4' : '#C0B4D5', // Mengubah warna latar belakang jika genre dipilih
      }}
      onPress={() => setSelectedGenre(item.id)} // Mengatur genre yang dipilih saat item disentuh
    >
      <Text style={styles.genreText}>{item.name}</Text>
      {/* Menampilkan nama genre */}
    </TouchableOpacity>
  )

  // Mengembalikan elemen UI untuk komponen CategorySearch
  return (
    <View>
      <FlatList
        data={genres} // Data yang akan dirender dalam daftar
        renderItem={renderGenreItem} // Fungsi untuk merender setiap item genre
        keyExtractor={(item) => item.id.toString()} // Menentukan kunci unik untuk setiap item
        numColumns={2} // Mengatur jumlah kolom menjadi 2
        contentContainerStyle={styles.genresContainer} // Menambahkan gaya untuk konten daftar
      />
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Search</Text>
        {/* Teks pada tombol pencarian */}
      </TouchableOpacity>
    </View>
  )
}

// Mendefinisikan gaya untuk komponen CategorySearch
const styles = StyleSheet.create({
  genresContainer: {
    padding: 8, // Menambahkan padding di sekitar container genre
  },
  genreItem: {
    flex: 1, // Membuat item genre memiliki ukuran fleksibel
    margin: 4, // Menambahkan margin di sekitar item genre
    height: 50, // Menentukan tinggi item genre
    justifyContent: 'center', // Menyelaraskan konten ke tengah secara vertikal
    alignItems: 'center', // Menyelaraskan konten ke tengah secara horizontal
    borderRadius: 8, // Menambahkan radius pada sudut item genre
  },
  genreText: {
    color: 'white', // Mengatur warna teks menjadi putih
    fontSize: 16, // Mengatur ukuran font menjadi 16
    fontWeight: '400', // Mengatur ketebalan font menjadi 400
    textTransform: 'capitalize', // Mengubah huruf pertama setiap kata menjadi huruf kapital
  },
  searchButton: {
    backgroundColor: '#8978A4', // Mengatur warna latar belakang tombol pencarian
    padding: 20, // Menambahkan padding di sekitar teks tombol
    borderRadius: 50, // Menambahkan radius pada sudut tombol
    margin: 8, // Menambahkan margin di sekitar tombol
  },
  searchButtonText: {
    textAlign: 'center', // Menyelaraskan teks ke tengah secara horizontal
    color: 'white', // Mengatur warna teks menjadi putih
    fontSize: 16, // Mengatur ukuran font menjadi 16
    fontWeight: '400', // Mengatur ketebalan font menjadi 400
  },
})

export default CategorySearch // Mengekspor komponen agar dapat digunakan di tempat lain.
