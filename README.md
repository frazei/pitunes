<h1>pitunes</h1> è un semplice player realizzato in html+js (grazie a <a href="https://github.com/acroyear/js-subsonic">js-subsonic by acroyear</a>) per accedere facilmente alla modalità jukebox di subsonic tramite web browser.<br />
<br />
How to install:<br />
<pre>
$ git clone https://github.com/frazei/pitunes.git
$ cd pitunes
$ git submodule update --init --recursive
</pre>
La configurazione si trova all'interno del file <i>index.html</i> nell'array <i>settings</i>:<br />
<ul>
  <li>server: url di accesso al server subsonic</li>
  <li>username e password: utente con accesso alla modalità jukebox (vedi settings di subsonic)</li>
  <li>listlen: quanti album visualizzare per volta</li>
  <li>watchInt: intervallo di aggiornamento del player</li>
</ul>
<br />
Per funzionare correttamente il dispositivo su cui è installato subsonic deve essere collegato ad un amplificatore tramite l'uscita audio (jack audio o hdmi).<br />
Sul raspberry (con raspian o simili) è necessario <b>sistemare un paio di cose</b>:
1. Impostare l'uscita audio di default (0=auto, 1=analog, 2=hdmi):
<pre>
$ amixer cset numid=3 1
</pre>
2. Fix dello script di avvio di subsonic:
<pre>
$ sudo vim /usr/bin/subsonic
</pre>
add the following line before the -verbose:gc \ line
<pre>
'-Djavax.sound.sampled.SourceDataLine=#ALSA [default]' \
</pre>
3. Sostituire ffmpeg con libav-tools (in raspian non c'è ffmpeg):
<pre>
$ sudo apt-get install libav-tools
$ cd /var/subsonic/transcode
$ mv ffmpeg ffmpeg.ori
$ ln -s /usr/bin/avconv ffmpeg
</pre>
