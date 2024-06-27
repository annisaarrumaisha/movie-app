// Mengimpor React untuk mendukung penulisan komponen dengan JSX
import React from 'react'

// Mengimpor createNativeStackNavigator dari @react-navigation/native-stack
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// Mengimpor layar Home, MovieDetail, CategorySearch, dan CategorySearchResult yang akan digunakan dalam stack navigasi
import Home from '../screens/Home'
import MovieDetail from '../screens/MovieDetail'
import CategorySearch from '../components/search/CategorySearch'
import CategorySearchResult from '../screens/CategorySearchResult'

// Membuat objek stack navigator untuk navigasi bertingkat/bertumpuk
const Stack = createNativeStackNavigator()

// Mendefinisikan komponen HomeStackNavigation untuk mengatur navigasi bertingkat
const HomeStackNavigation = (): JSX.Element => (
  // Mengatur Stack.Navigator sebagai container untuk layar-layar kita
  <Stack.Navigator>
    {/* Mendefinisikan layar Home sebagai layar awal */}
    <Stack.Screen
      name="HomeStack" // Mengganti nama layar menjadi "HomeStack"
      component={Home} // Komponen yang akan dirender untuk layar ini
      options={{ headerShown: false }} // Menyembunyikan header bar untuk layar ini
    />
    {/* Mendefinisikan layar MovieDetail untuk navigasi ke layar detail */}
    <Stack.Screen
      name="MovieDetail" // Nama layar sebagai "MovieDetail"
      component={MovieDetail} // Komponen yang akan dirender untuk layar ini
      options={{ title: 'Movie Detail' }} // Menampilkan judul khusus di header bar
    />
    {/* Mendefinisikan layar CategorySearch untuk navigasi ke layar pencarian berdasarkan kategori */}
    <Stack.Screen
      name="CategorySearch" // Nama layar sebagai "CategorySearch"
      component={CategorySearch} // Komponen yang akan dirender untuk layar ini
      options={{ title: 'Category Search' }} // Menampilkan judul khusus di header bar
    />
    {/* Mendefinisikan layar CategorySearchResult untuk menampilkan hasil pencarian berdasarkan kategori */}
    <Stack.Screen
      name="CategorySearchResult" // Nama layar sebagai "CategorySearchResult"
      component={CategorySearchResult} // Komponen yang akan dirender untuk layar ini
      options={{ title: 'Search Results' }} // Menampilkan judul khusus di header bar
    />
  </Stack.Navigator>
)

// Mengekspor komponen HomeStackNavigation sebagai default export dari modul ini
export default HomeStackNavigation
