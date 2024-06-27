// Mengimpor React dan hooks useState untuk state management
import React, { useState } from 'react'
// Mengimpor komponen dari React Native untuk membuat UI
import {
  View, // Komponen untuk membuat container
  Text, // Komponen untuk menampilkan teks
  TouchableOpacity, // Komponen untuk membuat tombol yang bisa disentuh
  StyleSheet, // Modul untuk membuat style CSS di React Native
  SafeAreaView, // Mengimpor SafeAreaView untuk menghindari konten terpotong
} from 'react-native'
// Mengimpor komponen KeywordSearch dan CategorySearch
import KeywordSearch from '../components/search/KeywordSearch'
import CategorySearch from '../components/search/CategorySearch'

// Mendefinisikan komponen Search
const Search = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState<string>('KeywordSearch') // State untuk menyimpan tab yang aktif

  // Mengembalikan elemen UI untuk komponen Search
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Komponen navigasi untuk memilih tab pencarian */}
        <View style={styles.tabContainer}>
          {['KeywordSearch', 'CategorySearch'].map((tab, index) => (
            <TouchableOpacity
              key={tab}
              activeOpacity={0.9} // Tingkat opacity saat tombol ditekan
              style={{
                ...styles.tabButton,
                backgroundColor: activeTab === tab ? '#8978A4' : '#C0B4D5', // Warna latar belakang berdasarkan tab aktif
                borderTopLeftRadius: index === 0 ? 100 : 0, // Radius sudut kiri atas untuk tab pertama
                borderBottomLeftRadius: index === 0 ? 100 : 0, // Radius sudut kiri bawah untuk tab pertama
                borderTopRightRadius: index === 1 ? 100 : 0, // Radius sudut kanan atas untuk tab kedua
                borderBottomRightRadius: index === 1 ? 100 : 0, // Radius sudut kanan bawah untuk tab kedua
              }}
              onPress={() => setActiveTab(tab)} // Mengubah tab aktif saat tombol diklik
            >
              <Text style={styles.tabButtonText}>
                {tab === 'KeywordSearch' ? 'Keyword' : 'Category'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Menampilkan komponen pencarian berdasarkan tab yang dipilih */}
        {activeTab === 'KeywordSearch' && <KeywordSearch />}
        {/* Menampilkan KeywordSearch jika tab yang aktif adalah KeywordSearch */}
        {activeTab === 'CategorySearch' && <CategorySearch />}
        {/* Menampilkan CategorySearch jika tab yang aktif adalah CategorySearch */}
      </View>
    </SafeAreaView>
  )
}

// Mendefinisikan gaya untuk komponen
const styles = StyleSheet.create({
  safeArea: {
    flex: 1, // Mengisi seluruh ruang yang tersedia
    backgroundColor: 'white', // Warna latar belakang putih
  },
  container: {
    flex: 1, // Mengisi seluruh ruang yang tersedia
    padding: 16, // Menambahkan padding di sekitar kontainer
  },
  tabContainer: {
    flexDirection: 'row', // Mengatur arah flex menjadi baris
    marginBottom: 16, // Menambahkan margin bawah
  },
  tabButton: {
    alignItems: 'center', // Menyelaraskan item di tengah secara horizontal
    justifyContent: 'center', // Menyelaraskan item di tengah secara vertikal
    width: '50%', // Lebar tombol adalah 50% dari lebar kontainer
    height: 60, // Tinggi tombol adalah 60
  },
  tabButtonText: {
    color: 'white', // Warna teks putih
    fontSize: 20, // Ukuran teks
    fontWeight: '400', // Ketebalan teks
    textTransform: 'capitalize', // Mengubah teks menjadi huruf kapital pada awal kata
  },
})

export default Search
