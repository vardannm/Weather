import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface WeatherState {
  currentWeather: any;
  dailyWeather: any[];
  status: 'idle' | 'loading' | 'failed';
  unit: 'metric' | 'imperial';
}

const initialState: WeatherState = {
  currentWeather: null,
  dailyWeather: [],
  status: 'idle',
  unit: 'metric',
};

// nerka pahi exanaky
export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async ({ city, unit }: { city: string; unit: 'metric' | 'imperial' }) => {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=0b11ac2ec4f25f52e26c780a50b82f62&units=${unit}`
    );
    return response.data;
  }
);

// myus 5 orvany
export const fetchForecast = createAsyncThunk(
  'weather/fetchForecast',
  async ({ city, unit }: { city: string; unit: 'metric' | 'imperial' }) => {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=0b11ac2ec4f25f52e26c780a50b82f62&units=${unit}`
    );
    
    
    const dailyForecast = response.data.list.reduce((acc: any[], cur: any) => {
      const date = cur.dt_txt.split(' ')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          temps: [cur.main.temp],
          weather: cur.weather[0].description,
        };
      } else {
        acc[date].temps.push(cur.main.temp);
      }
      return acc;
    }, {});

    return Object.values(dailyForecast);
  }
);

export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    toggleUnit: (state) => {
      state.unit = state.unit === 'metric' ? 'imperial' : 'metric';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.status = 'idle';
        state.currentWeather = action.payload;
      })
      .addCase(fetchWeather.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchForecast.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        state.status = 'idle';
        state.dailyWeather = action.payload;
      })
      .addCase(fetchForecast.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { toggleUnit } = weatherSlice.actions;
export default weatherSlice.reducer;
