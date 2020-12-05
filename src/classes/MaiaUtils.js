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
            'id':pb_mode.getId(),
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

    static packModeId(modeConfig) {
        let pb_mode = new maia_pb.ModeId();
        pb_mode.setId(modeConfig.id);
        return pb_mode.serializeBinary();
    }

    static unpackModeId(buffer) {
        return maia_pb.ModeId.deserializeBinary(buffer);
    }

    static packRules(rulesObject) {
        let settings = new maia_pb.Settings();
        settings.setSmartMode(rulesObject['dayTimeAuto']['active']);
        settings.setAutoOffSound(rulesObject['silentAutoOff']['active']);
        settings.setAutoOffSoundHours(parseInt(rulesObject['silentAutoOff']['duration']));
        settings.setAutoOn(rulesObject['autoOn']['active']);
        if (rulesObject['autoOn']['onLightLevel']['active'] == true) {
            settings.setAutoOnMode(maia_pb.auto_mode_t.LIGHT_LEVEL);
        }
        else {
            settings.setAutoOnMode(maia_pb.auto_mode_t.TIME);
        }
        settings.setAutoOnLlTimeLocked(rulesObject['autoOn']['onLightLevel']['withStartTime']);
        settings.setAutoOnLlAfterTime(this.encodeHours(rulesObject['autoOn']['onLightLevel']['startTime']));
        settings.setAutoOnTime(this.encodeHours(rulesObject['autoOn']['onSchedule']['startTime']));
        settings.setAutoOnTimeDimm(rulesObject['autoOn']['onSchedule']['withStartDimmingTime']);
        settings.setAutoOnTimeDimmTime(this.encodeHours(rulesObject['autoOn']['onSchedule']['startDimmingTime']));

        settings.setAutoOff(rulesObject['autoOff']['active']);
        if (rulesObject['autoOff']['onLightLevel']['active'] == true) {
            settings.setAutoOffMode(maia_pb.auto_mode_t.LIGHT_LEVEL);
        }
        else {
            settings.setAutoOffMode(maia_pb.auto_mode_t.TIME);
        }
        settings.setAutoOffLlTimeLocked(rulesObject['autoOff']['onLightLevel']['withStartTime']);
        settings.setAutoOffLlAfterTime(this.encodeHours(rulesObject['autoOff']['onLightLevel']['startTime']));
        settings.setAutoOffTime(this.encodeHours(rulesObject['autoOff']['onSchedule']['startTime']));
        settings.setAutoOffTimeDimm(rulesObject['autoOff']['onSchedule']['withStartDimmingTime']);
        settings.setAutoOffTimeDimmTime(this.encodeHours(rulesObject['autoOff']['onSchedule']['startDimmingTime']));
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

    static zeroPad(num, places) {
        var zero = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
    }

    static decodeHours(value) {
        return String(this.zeroPad(Math.floor(value/60), 2)) + ':' + String(this.zeroPad(value % 60, 2));
    }

    static encodeHours(value) {
        return parseInt(value.substring(0,2)) * 60 + parseInt(value.substring(3,5));
    }

    static unpackSettings(buffer) {
        let pb_settings = maia_pb.Settings.deserializeBinary(buffer);
        
        const settings = {
            'dayTimeAuto': {
                'active':pb_settings.getSmartMode()
            },
            'silentAutoOff': {
                'active':pb_settings.getAutoOffSound(), 
                'duration':pb_settings.getAutoOffSoundHours()
            },
            'autoOn':{
                'active':pb_settings.getAutoOn(),
                'onLightLevel':{
                    'startTime':this.decodeHours(pb_settings.getAutoOnLlAfterTime()),
                    'withStartTime':pb_settings.getAutoOnLlTimeLocked(),
                    'active':pb_settings.getAutoOnMode() == maia_pb.auto_mode_t.LIGHT_LEVEL
                },
                'onSchedule':{
                    'startTime':this.decodeHours(pb_settings.getAutoOnTime()),
                    'withStartDimmingTime':pb_settings.getAutoOnTimeDimm(),
                    'startDimmingTime':this.decodeHours(pb_settings.getAutoOnTimeDimmTime()),
                    'active':pb_settings.getAutoOnMode() == maia_pb.auto_mode_t.TIME
                },
            },
            'autoOff':{
                'active':pb_settings.getAutoOff(),
                'onLightLevel':{
                    'startTime':this.decodeHours(pb_settings.getAutoOnLlAfterTime()),
                    'withStartTime':pb_settings.getAutoOffLlTimeLocked(),
                    'active':pb_settings.getAutoOffMode() == maia_pb.auto_mode_t.LIGHT_LEVEL
                },
                'onSchedule':{
                    'startTime':this.decodeHours(pb_settings.getAutoOffTime()),
                    'withStartDimmingTime':pb_settings.getAutoOffTimeDimm(),
                    'startDimmingTime':this.decodeHours(pb_settings.getAutoOffTimeDimmTime()),
                    'active':pb_settings.getAutoOffMode() == maia_pb.auto_mode_t.TIME
                },
            },
        }
        return settings;
    }
}

export default MaiaUtils;