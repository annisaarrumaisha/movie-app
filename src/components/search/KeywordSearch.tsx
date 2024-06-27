import React, { useState } from 'react'
import {
  View, // Komponen View digunakan sebagai container atau pembungkus untuk komponen lainnya.
  TextInput, // Komponen TextInput untuk input teks pengguna.
  FlatList, // Komponen FlatList untuk membuat daftar bergulir.
  TouchableOpacity, // Komponen TouchableOpacity untuk membuat tombol yang dapat disentuh dengan efek opacity.
  ImageBackground, // Komponen untuk menampilkan gambar latar belakang.
  Text, // Komponen Text untuk menampilkan teks.
  StyleSheet, // StyleSheet digunakan untuk membuat style CSS dalam React Native.
  SafeAreaView, // SafeAreaView memastikan konten berada dalam area aman layar perangkat.
} from 'react-native'
import { API_URL, API_ACCESS_TOKEN } from '@env' // Mengimpor URL API dan token akses dari file konfigurasi lingkungan (.env).
import { useNavigation } from '@react-navigation/native' // Hook untuk navigasi antara layar dalam aplikasi.
import { FontAwesome } from '@expo/vector-icons' // Mengimpor ikon dari FontAwesome library.
import { LinearGradient } from 'expo-linear-gradient' // Mengimpor LinearGradient untuk efek gradasi pada komponen.

const KeywordSearch = (): JSX.Element => {
  const [keyword, setKeyword] = useState<string>('') // State untuk menyimpan kata kunci pencarian.
  const [movies, setMovies] = useState<any[]>([]) // State untuk menyimpan daftar film yang ditemukan dari pencarian.
  const navigation = useNavigation<any>() // Hook untuk menggunakan fungsi navigasi.

  // Fungsi untuk mencari film berdasarkan kata kunci.
  const searchMovies = (): void => {
    if (!API_URL || !API_ACCESS_TOKEN) {
      console.error('ENV not found') // Menampilkan kesalahan jika ENV (URL API atau token akses) tidak ditemukan.
      return
    }

    if (keyword.trim() === '') {
      console.warn('Keyword is empty') // Menampilkan peringatan jika kata kunci kosong.
      return
    }

    // Membuat URL untuk mencari film berdasarkan kata kunci.
    const url = `${API_URL}/search/movie?query=${keyword}`
    const options = {
      method: 'GET', // Menggunakan metode GET untuk mengambil data.
      headers: {
        accept: 'application/json', // Menentukan bahwa respons yang diinginkan adalah JSON.
        Authorization: `Bearer ${API_ACCESS_TOKEN}`, // Menambahkan token akses ke header untuk otentikasi.
      },
    }

    // Mengirim permintaan fetch ke API untuk mengambil data film berdasarkan kata kunci.
    fetch(url, options)
      .then((response) => response.json()) // Mengurai respons menjadi objek JSON.
      .then((response) => {
        setMovies(response.results) // Menyimpan hasil pencarian film ke state movies.
        console.log(response.results) // Menampilkan hasil pencarian di konsol untuk debugging.
      })
      .catch((err) => {
        console.error(err) // Menampilkan kesalahan di konsol jika permintaan gagal.
      })
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Menggunakan View sebagai container untuk input pencarian dan hasil pencarian */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Input title movie here" // Placeholder teks dalam input untuk memberi tahu pengguna tentang fungsi input.
            value={keyword} // Menghubungkan nilai input dengan state keyword.
            onChangeText={setKeyword} // Mengatur nilai state keyword saat teks dalam input berubah.
            onSubmitEditing={searchMovies} // Memanggil fungsi searchMovies saat pengguna menekan tombol submit pada keyboard.
          />
        </View>
        {/* Menampilkan daftar film yang ditemukan */}
        <FlatList
          data={movies} // Menentukan data yang akan dirender oleh FlatList, yaitu daftar film.
          keyExtractor={(item) => item.id.toString()} // Menggunakan ID film sebagai kunci unik untuk setiap item dalam daftar.
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() =>
                navigation.navigate('MovieDetail', { id: item.id })
              } // Navigasi ke layar detail film saat item disentuh.
            >
              <ImageBackground
                resizeMode="cover"
                style={styles.backgroundImage}
                imageStyle={styles.backgroundImageStyle}
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                }} // URL gambar poster film dari API.
              >
                <LinearGradient
                  colors={['#00000000', 'rgba(0, 0, 0, 0.7)']} // Warna gradasi dari transparan ke hitam.
                  locations={[0.6, 0.8]} // Posisi gradasi untuk efek visual.
                  style={styles.gradientStyle}
                >
                  <Text style={styles.title}>{item.title}</Text>
                  {/* Menampilkan judul film */}
                  <View style={styles.ratingContainer}>
                    <FontAwesome name="star" size={16} color="yellow" />
                    {/* Ikon bintang untuk rating */}
                    <Text style={styles.rating}>
                      {item.vote_average.toFixed(1)}
                    </Text>
                    {/* Menampilkan rating film */}
                  </View>
                </LinearGradient>
              </ImageBackground>
            </TouchableOpacity>
          )}
          numColumns={3} // Menampilkan item dalam 3 kolom.
          showsVerticalScrollIndicator={false} // Menyembunyikan scrollbar vertikal.
          contentContainerStyle={styles.listContent} // Menambahkan gaya pada konten daftar.
        />
      </View>
    </SafeAreaView>
  )
}

// Mendefinisikan gaya untuk komponen menggunakan StyleSheet.
const styles = StyleSheet.create({
  safeArea: {
    flex: 1, // Mengisi seluruh ruang yang tersedia.
    backgroundColor: 'white', // Warna latar belakang putih.
  },
  container: {
    flex: 1, // Mengisi seluruh ruang yang tersedia.
    padding: 16, // Padding di sekitar kontainer.
  },
  searchContainer: {
    flexDirection: 'row', // Mengatur item dalam container ini secara horizontal.
    alignItems: 'center', // Menyelaraskan item di tengah secara vertikal.
    marginBottom: 16, // Margin di bawah container pencarian.
  },
  input: {
    flex: 1, // Mengisi seluruh ruang yang tersedia.
    height: 40, // Tinggi input.
    borderColor: 'black', // Warna border hitam.
    borderWidth: 1, // Lebar border 1 piksel.
    marginBottom: 8, // Margin di bawah input.
    paddingHorizontal: 8, // Padding horizontal di dalam input.
    borderRadius: 20, // Membuat sudut border melengkung.
  },
  itemContainer: {
    flex: 1, // Membuat item memiliki ukuran fleksibel.
    margin: 5, // Margin sekitar item.
  },
  backgroundImage: {
    aspectRatio: 2 / 3, // Rasio aspek 2:3 untuk gambar.
  },
  backgroundImageStyle: {
    borderRadius: 8, // Membuat sudut gambar melengkung.
  },
  gradientStyle: {
    padding: 8, // Padding di dalam gradien.
    height: '100%', // Tinggi penuh.
    width: '100%', // Lebar penuh.
    borderRadius: 8, // Membuat sudut container gradien melengkung.
    display: 'flex', // Menampilkan flexbox.
    justifyContent: 'flex-end', // Menyelaraskan konten ke bawah.
  },
  title: {
    color: 'white', // Warna teks putih.
  },
  ratingContainer: {
    flexDirection: 'row', // Mengatur item dalam container ini secara horizontal.
    alignItems: 'center', // Menyelaraskan item di tengah secara vertikal.
    gap: 2, // Menambahkan jarak antar item.
  },
  rating: {
    color: 'yellow', // Warna teks kuning.
    fontWeight: '700', // Ketebalan font.
  },
  listContent: {
    paddingBottom: 20, // Padding di bawah daftar untuk mencegah konten tertindih.
  },
})

export default KeywordSearch // Mengekspor komponen agar dapat digunakan di tempat lain.
