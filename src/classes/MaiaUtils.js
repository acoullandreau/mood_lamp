import maia_pb from './maia_pb';

class MaiaUtils {
    static packModesList(modesObject) {
        let modes_list = new maia_pb.ModeList();

        for (let i = 0; i < modesObject.modesArray.length; i++) {
            let mode = modesObject.modesArray[i];
            modes_list.addModes(MaiaUtils.packMode(mode));
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

    static packModeUpdate(mode, update) {
        let pb_mode_update = new maia_pb.ModeUpdate();
        pb_mode_update.setId(mode.id);
        if ('speed' in update) {
            pb_mode_update.setSpeed(update.speed);
            pb_mode_update.setColorIndex(255);
        }
        if ('color' in update && 'color_index' in update) {
            let pb_color = new maia_pb.Color();
            let converted = (update.color.r << 16) | (update.color.g << 8) | (update.color.b);
            pb_color.setRgb(converted);
            pb_mode_update.addColors(pb_color);
            pb_mode_update.setColorIndex(update.color_index);
            pb_mode_update.setModeNumColors(mode['colors'].length);
            pb_mode_update.setSpeed(255);
        }
        if ('colors' in update) {
            // update multiple colors
        }
        return pb_mode_update.serializeBinary();
    }

    static packMode(mode, serialize) {
        let pb_mode = new maia_pb.Mode();
        pb_mode.setId(mode.id);
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
        if (serialize === true) {
            return pb_mode.serializeBinary();
        }
        else {
            return pb_mode;
        }
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
        if (rulesObject['autoOn']['onLightLevel']['active'] === true) {
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
        if (rulesObject['autoOff']['onLightLevel']['active'] === true) {
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
        }
        // currently unavailable readings
            // 'noise':'--',
            // 'battery':'--',
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
                    'active':pb_settings.getAutoOnMode() === maia_pb.auto_mode_t.LIGHT_LEVEL
                },
                'onSchedule':{
                    'startTime':this.decodeHours(pb_settings.getAutoOnTime()),
                    'withStartDimmingTime':pb_settings.getAutoOnTimeDimm(),
                    'startDimmingTime':this.decodeHours(pb_settings.getAutoOnTimeDimmTime()),
                    'active':pb_settings.getAutoOnMode() === maia_pb.auto_mode_t.TIME
                },
            },
            'autoOff':{
                'active':pb_settings.getAutoOff(),
                'onLightLevel':{
                    'startTime':this.decodeHours(pb_settings.getAutoOnLlAfterTime()),
                    'withStartTime':pb_settings.getAutoOffLlTimeLocked(),
                    'active':pb_settings.getAutoOffMode() === maia_pb.auto_mode_t.LIGHT_LEVEL
                },
                'onSchedule':{
                    'startTime':this.decodeHours(pb_settings.getAutoOffTime()),
                    'withStartDimmingTime':pb_settings.getAutoOffTimeDimm(),
                    'startDimmingTime':this.decodeHours(pb_settings.getAutoOffTimeDimmTime()),
                    'active':pb_settings.getAutoOffMode() === maia_pb.auto_mode_t.TIME
                },
            },
        }
        return settings;
    }

    static stdTimezoneOffset(ts) {
        var jan = new Date(ts.getFullYear(), 0, 1);
        var jul = new Date(ts.getFullYear(), 6, 1);
        return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    }

    static isDstObserved(ts) {
        return ts.getTimezoneOffset() < this.stdTimezoneOffset(ts);
    }

    static packTime(ts) {
        let pb_time = new maia_pb.Time();
        pb_time.setSec(ts.getSeconds());
        pb_time.setMin(ts.getMinutes());
        pb_time.setHour(ts.getHours());
        pb_time.setWday(ts.getDay());
        pb_time.setMday(ts.getDate());
        pb_time.setMon(ts.getMonth());
        pb_time.setYear(ts.getFullYear());
        pb_time.setIsDst(this.isDstObserved(ts));
        return pb_time.serializeBinary();
    }

    static decorateModes(modesArray, configFile) {
        /**
            This function is in charge of adding the name and the orderIndex to the preconfigured modes.
            It is called by MaiaService.getInitSetting() with the modesArray obtained from the microcontroller
            and the config file with the preconfigured modes settings, in particular name and orderIndex.
        */


        for (var i = 0; i < modesArray.length ; i++) {
            if (modesArray[i]['isOriginMode']) {
                // add the name and orderIndex to the preconfigured modes
                var modeId = modesArray[i]['id'];
                modesArray[i]['name'] = configFile.modesSettings[modeId]['fr']
                modesArray[i]['orderIndex'] = configFile.modesSettings[modeId]['orderIndex']
            }
            // temporary, while the saved models used for testing are not really user saved
            else {
                // assign an orderIndex using the id to sort the modes when displaying it in the app
                modesArray[i]['orderIndex'] = modesArray[i]['id'];
            }

        }
        return modesArray;

    }
}

export default MaiaUtils;