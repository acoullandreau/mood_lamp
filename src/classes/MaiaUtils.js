import maia_pb from './maia_pb';

class MaiaUtils {
    static packModesList(modesObject) {
        let modes_list = new maia_pb.ModeList();
        
        for (let i = 0; i < modesObject.modesArray.length; i++) {
            let mode = modesObject.modesArray[i];
            modes_list.addModes(MaiaUtils.packMode(mode, i));
        }

        return modes_list.serializeBinary();
    }

    static unpackModesList(buffer) {
        return maia_pb.ModeList.deserializeBinary(buffer);
    }

    static unpackMode(pb_mode) {
        let mode = {
            'name':pb_mode.getName(),
            'isOriginMode':!pb_mode.getUserMode(),
            'isEditable':pb_mode.getEditable(),
            'colors':[],
            'speed':pb_mode.getSpeed()
        };
        let pb_colors = pb_mode.getColorsList();
        for (let index in pb_colors) {
            let color = pb_colors[index].getRgb();
            let r = (color & 0xFF0000) >> 16;
            let g = (color & 0xFF00) >> 8;
            let b = (color & 0xFF);
            mode['colors'].push({
                r: r,
                g: g,
                b: b
            });
        }        
        return mode;
    }

    static packMode(mode, id) {
        let pb_mode = new maia_pb.Mode();
        pb_mode.setId(id);
        pb_mode.setName(mode.name);
        pb_mode.setSpeed(mode.speed);
        pb_mode.setEditable(mode.isEditable);
        pb_mode.setUserMode(!mode.isOriginMode);
        for (let index in mode.colors) {
            let color = mode.colors[index];
            let pb_color = new maia_pb.Color();
            let converted = (color.r << 16) | (color.g << 8) | (color.b);
            pb_color.setRgb(converted);
            pb_mode.addColors(pb_color);
        }
        return pb_mode;
    }

    static packRules(rulesObject) {
        let settings = new maia_pb.Settings();
        console.log(rulesObject);
        return settings.serializeBinary();
    }

    static unpackReadings(buffer) {
        let pb_readings = maia_pb.Readings.deserializeBinary(buffer);
        let readings = {
            'temperature':pb_readings.getTemperature().toFixed(2) || '--',
            'humidity':pb_readings.getHumidity().toFixed(2) || '--',
            'pressure':pb_readings.getPressure() || '--',
            'noise':'--',
            'battery':'--',
        }
        return readings;
    }

}

export default MaiaUtils;