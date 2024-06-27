// Mengimpor React dan komponen yang dibutuhkan dari React Native
import React, { useEffect, useState } from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity, // Menambahkan TouchableOpacity untuk mendeteksi klik pada ikon heart
  StyleSheet,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons' // Mengimpor ikon FontAwesome
import { API_URL, API_ACCESS_TOKEN } from '@env' // Mengimpor variabel lingkungan dari file .env
import MovieList from '../components/movies/MovieList' // Mengimpor komponen MovieList dari folder components
import AsyncStorage from '@react-native-async-storage/async-storage' // Mengimpor AsyncStorage untuk penyimpanan lokal

// Mendefinisikan komponen MovieDetail yang menerima props, termasuk route untuk mendapatkan parameter navigasi
const MovieDetail = ({ route, navigation }: any): JSX.Element => {
  const { id } = route.params // Mengambil id dari parameter route
  const [movie, setMovie] = useState<any>(null) // State untuk menyimpan detail film
  const [recommendations, setRecommendations] = useState<any[]>([]) // State untuk menyimpan rekomendasi film
  const [isFavorite, setIsFavorite] = useState<boolean>(false) // State untuk status favorit

  // Fungsi fetchData untuk mengambil data dari API
  const fetchData = (): void => {
    if (API_URL == null || API_ACCESS_TOKEN == null) {
      throw new Error('ENV not found') // Menampilkan kesalahan jika ENV tidak ditemukan
    }

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`, // Menggunakan token akses dalam header Authorization
      },
    }

    fetch(`${API_URL}/movie/${id}?language=en-US`, options)
      .then((response) => response.json()) // Mengurai respons menjadi objek JSON
      .then((response) => {
        setMovie(response) // Menyimpan data respons ke state movie
      })
      .catch((err) => {
        console.error(err) // Menampilkan kesalahan di konsol jika permintaan gagal
      })
  }

  // Fungsi fetchRecommendations untuk mengambil data rekomendasi film dari API
  const fetchRecommendations = (): void => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`, // Menggunakan token akses dalam header Authorization
      },
    }

    fetch(
      `${API_URL}/movie/${id}/recommendations?language=en-US&page=1`,
      options,
    )
      .then((response) => response.json()) // Mengurai respons menjadi objek JSON
      .then((response) => {
        setRecommendations(response.results) // Menyimpan data respons ke state recommendations
      })
      .catch((err) => {
        console.error(err) // Menampilkan kesalahan di konsol jika permintaan gagal
      })
  }

  // Fungsi untuk menambahkan film ke daftar favorit
  const addFavorite = async (movie: any): Promise<void> => {
    try {
      const initialData: string | null =
        await AsyncStorage.getItem('@FavoriteList')
      let favMovieList: any[] = initialData ? JSON.parse(initialData) : []

      favMovieList.push(movie) // Menambahkan film ke daftar favorit
      await AsyncStorage.setItem('@FavoriteList', JSON.stringify(favMovieList)) // Menyimpan daftar favorit ke AsyncStorage
      setIsFavorite(true) // Mengubah status favorit menjadi true
    } catch (error) {
      console.log(error) // Menampilkan kesalahan jika proses gagal
    }
  }

  // Fungsi untuk menghapus film dari daftar favorit
  const removeFavorite = async (id: number): Promise<void> => {
    try {
      const initialData: string | null =
        await AsyncStorage.getItem('@FavoriteList')
      if (initialData) {
        let favMovieList: any[] = JSON.parse(initialData)
        favMovieList = favMovieList.filter((movie) => movie.id !== id) // Menghapus film dari daftar favorit
        await AsyncStorage.setItem(
          '@FavoriteList',
          JSON.stringify(favMovieList),
        ) // Menyimpan daftar favorit yang diperbarui ke AsyncStorage
        setIsFavorite(false) // Mengubah status favorit menjadi false
      }
    } catch (error) {
      console.log(error) // Menampilkan kesalahan jika proses gagal
    }
  }

  // Fungsi untuk memeriksa apakah film sudah menjadi favorit
  const checkIsFavorite = async (id: number): Promise<void> => {
    try {
      const initialData: string | null =
        await AsyncStorage.getItem('@FavoriteList')
      if (initialData) {
        const favMovieList: any[] = JSON.parse(initialData)
        const isFav = favMovieList.some((movie) => movie.id === id) // Memeriksa apakah film ada dalam daftar favorit
        setIsFavorite(isFav) // Mengatur state isFavorite berdasarkan hasil pemeriksaan
      }
    } catch (error) {
      console.log(error) // Menampilkan kesalahan jika proses gagal
    }
  }

  // Mengambil data film dan rekomendasi saat komponen dimuat
  useEffect(() => {
    fetchData() // Memanggil fungsi fetchData
    fetchRecommendations() // Memanggil fungsi fetchRecommendations
    checkIsFavorite(id) // Memeriksa status favorit saat komponen dimuat
  }, [id])

  // Mengembalikan elemen UI untuk komponen MovieDetail
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {movie && ( // Menampilkan detail film jika data tersedia
          <>
            <View style={styles.posterContainer}>
              <Image
                style={styles.poster}
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                }} // Sumber gambar poster film
              />
              <View style={styles.ratingContainer}>
                <FontAwesome name="star" size={16} color="yellow" />
                <Text style={styles.rating}>
                  {movie.vote_average.toFixed(1)}
                </Text>
                {/* Menampilkan rating dengan bintang */}
              </View>
              {/* Tambahkan TouchableOpacity untuk ikon heart */}
              <TouchableOpacity
                style={styles.heartIcon}
                onPress={() => {
                  if (isFavorite) {
                    removeFavorite(movie.id) // Hapus dari favorit jika sudah ada
                  } else {
                    addFavorite(movie) // Tambahkan ke favorit jika belum ada
                  }
                }}
              >
                <FontAwesome
                  name={isFavorite ? 'heart' : 'heart-o'} // Menampilkan ikon heart penuh atau kosong berdasarkan isFavorite
                  size={30}
                  color="red"
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.title}>{movie.title}</Text>
            {/* Menampilkan judul film */}
            <Text style={styles.overview}>{movie.overview}</Text>
            {/* Menampilkan sinopsis film */}
            <Text style={styles.label}>Release Date:</Text>
            <Text style={styles.value}>{movie.release_date}</Text>
            {/* Menampilkan tanggal rilis */}
            <Text style={styles.label}>Rating:</Text>
            <Text style={styles.value}>{movie.vote_average}</Text>
            {/* Menampilkan rata-rata vote */}
            <Text style={styles.label}>Runtime:</Text>
            <Text style={styles.value}>{movie.runtime} minutes</Text>
            {/* Menampilkan durasi film */}
            <Text style={styles.label}>Original Language:</Text>
            <Text style={styles.value}>{movie.original_language}</Text>
            {/* Menampilkan bahasa asli */}
            <Text style={styles.label}>Popularity:</Text>
            <Text style={styles.value}>{movie.popularity}</Text>
            {/* Menampilkan popularitas */}
            <Text style={styles.label}>Vote Count:</Text>
            <Text style={styles.value}>{movie.vote_count}</Text>
            {/* Menampilkan jumlah vote */}
          </>
        )}
        <MovieList
          title="Recommendations" // Judul untuk daftar rekomendasi film
          path={`movie/${id}/recommendations?language=en-US&page=1`} // Path untuk mengambil data rekomendasi
          coverType="poster" // Tipe cover yang digunakan (poster)
        />
      </ScrollView>
    </SafeAreaView>
  )
}

// Mendefinisikan gaya untuk komponen
const styles = StyleSheet.create({
  safeArea: {
    flex: 1, // Memastikan SafeAreaView mengambil seluruh layar
  },
  container: {
    padding: 16, // Menambahkan padding di sekitar kontainer
    paddingBottom: 35, // Menambahkan padding bawah untuk memberi ruang pada tombol navigasi
  },
  posterContainer: {
    position: 'relative', // Mengatur posisi relatif untuk kontainer poster
  },
  poster: {
    width: '100%', // Mengatur lebar gambar menjadi 100% dari lebar kontainer
    height: 400, // Mengatur tinggi gambar
    borderRadius: 10, // Mengatur radius border gambar
    marginBottom: 16, // Menambahkan margin bawah
  },
  ratingContainer: {
    position: 'absolute', // Mengatur posisi absolut untuk kontainer rating
    top: 10, // Mengatur jarak dari atas poster
    left: 10, // Mengatur jarak dari kiri poster
    flexDirection: 'row', // Mengatur arah tata letak dalam baris
    alignItems: 'center', // Menyelaraskan item di tengah secara vertikal
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Menambahkan latar belakang semi-transparan
    padding: 5, // Menambahkan padding dalam kontainer rating
    borderRadius: 5, // Menambahkan radius border untuk kontainer rating
  },
  rating: {
    fontSize: 16, // Mengatur ukuran font untuk rating
    color: 'yellow', // Mengatur warna teks rating
    marginLeft: 5, // Menambahkan margin kiri untuk teks rating
  },
  heartIcon: {
    position: 'absolute', // Mengatur posisi absolut untuk ikon heart
    top: 10, // Mengatur jarak dari atas poster
    right: 10, // Mengatur jarak dari kanan poster
    padding: 10, // Menambahkan padding untuk area klik
  },
  title: {
    fontSize: 24, // Mengatur ukuran font untuk judul
    fontWeight: 'bold', // Mengatur ketebalan font
    marginBottom: 8, // Menambahkan margin bawah
  },
  overview: {
    fontSize: 16, // Mengatur ukuran font untuk sinopsis
    marginBottom: 16, // Menambahkan margin bawah
  },
  label: {
    fontSize: 18, // Mengatur ukuran font untuk label
    fontWeight: 'bold', // Mengatur ketebalan font
    marginBottom: 4, // Menambahkan margin bawah
  },
  value: {
    fontSize: 16, // Mengatur ukuran font untuk nilai
    marginBottom: 12, // Menambahkan margin bawah
  },
})

export default MovieDetail // Mengekspor komponen MovieDetail agar dapat digunakan di tempat lain
